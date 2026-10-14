import * as fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import yaml from 'js-yaml';
import * as csstree from 'css-tree';
import Twig from 'twig';
import { parseHTML } from 'linkedom';
import { fileURLToPath } from 'node:url';

export async function validate(root) {
  const provenance = JSON.parse(await fs.readFile(path.join(root, 'starterkit-provenance.json'), 'utf8'));
  const counts = { themes: 0, upstreamFiles: 0, customTwig: 0, css: 0, libraryAssets: 0, fontAssets: 0, tabSuites: 0 };
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const hash = (data) => crypto.createHash('sha256').update(data).digest('hex');
  for (const theme of provenance.themes) {
    const id = theme.machine_name;
    const dir = path.join(root, 'themes/custom', id);
    const info = yaml.load(await fs.readFile(path.join(dir, id + '.info.yml'), 'utf8'));
    assert(/^[a-z][a-z0-9_]*$/.test(id), 'Invalid machine name: ' + id);
    assert(info.name === theme.name && info.core_version_requirement === '^11' && info['base theme'] === 'stable9' && !info.hidden, id + ': invalid metadata');
    assert(info.generator === provenance.generator, id + ': generator mismatch');
    assert(info.regions.content && info.regions.hero && info.regions.feature, id + ': missing content regions');
    for (const [source, expected] of Object.entries(provenance.source_sha256)) {
      const target = source.replaceAll('starterkit_theme', id);
      const bytes = await fs.readFile(path.join(dir, target));
      const sourceBytes = source.endsWith('.png') ? bytes : Buffer.from(bytes.toString().split('\n// Custom navigation support.\n')[0].replaceAll(id, 'starterkit_theme').replaceAll(theme.name, 'Starterkit theme'));
      // Unchanged upstream text may naturally contain the machine name (e.g. branding).
      const originalPrefix = source.endsWith('.png') ? bytes : Buffer.from(bytes.toString().split('\n// Custom navigation support.\n')[0]);
      assert(hash(originalPrefix) === expected || hash(sourceBytes) === expected, id + ': inherited file differs: ' + target);
      counts.upstreamFiles++;
    }
    const libraries = yaml.load(await fs.readFile(path.join(dir, id + '.libraries.yml'), 'utf8'));
    assert(libraries.design.dependencies.includes('core/drupal') && libraries.design.dependencies.includes('core/once'), id + ': missing behavior dependencies');
    for (const library of info.libraries) {
      if (library.startsWith(id + '/')) assert(libraries[library.split('/')[1]], id + ': missing attached library');
    }
    for (const library of Object.values(libraries)) {
      for (const group of Object.values(library.css || {})) for (const asset of Object.keys(group)) { await fs.access(path.join(dir, asset)); counts.libraryAssets++; }
      for (const asset of Object.keys(library.js || {})) { await fs.access(path.join(dir, asset)); counts.libraryAssets++; }
    }
    // Guard against inherited details spacing and the nested-menu display rule.
    const designCss = await fs.readFile(path.join(dir, 'css/design.css'), 'utf8');
    const navigationRules = new Map();
    csstree.walk(csstree.parse(designCss), { visit: 'Rule', enter(rule) {
      if (rule.prelude?.type !== 'SelectorList') return;
      const declarations = {};
      rule.block.children.forEach((declaration) => {
        if (declaration.type === 'Declaration') declarations[declaration.property] = csstree.generate(declaration.value);
      });
      rule.prelude.children.forEach((selector) => {
        const key = csstree.generate(selector);
        navigationRules.set(key, { ...navigationRules.get(key), ...declarations });
      });
    } });
    assert(navigationRules.get('.site-navigation ul.menu li>ul')?.display === 'none', id + ': submenu hiding must override the nested-menu display rule');
    const disclosureStyle = navigationRules.get('.site-navigation .menu-disclosure');
    assert(disclosureStyle?.margin === '0' && disclosureStyle?.border === '0', id + ': disclosure inherits details spacing');
    assert(navigationRules.get('.site-navigation .menu-disclosure>summary')?.padding === '0', id + ': summary inherits extra padding');
    assert(navigationRules.get('.site-navigation .menu-disclosure:not([open])>ul.menu')?.display === 'none', id + ': closed disclosure children visible');
    // Page-less parents must expose their children without JavaScript.
    const menuSource = await fs.readFile(path.join(dir, 'templates/navigation/menu--main.html.twig'), 'utf8');
    const attributes = () => ({ addClass() { return this; }, toString() { return ''; } });
    Twig.extendFunction('link', (title, url) => '<a href="' + (url.path || '#') + '">' + title + '</a>');
    const menuTemplate = Twig.twig({ data: menuSource, rethrow: true });
    const child = { title: 'Child page', url: { path: '/child' }, attributes: attributes(), below: [] };
    for (const routeName of ['<nolink>', '<button>']) {
      const markup = menuTemplate.render({ attributes: attributes(), items: [{ title: 'Parent', url: { isRouted: true, routeName }, attributes: attributes(), below: [child] }] });
      const rendered = parseHTML(markup).document;
      assert(rendered.querySelector('details > summary')?.textContent === 'Parent', id + ': page-less parent has no native disclosure');
      assert(rendered.querySelector('details a')?.getAttribute('href') === '/child', id + ': child link missing');
      assert(!rendered.querySelector('details[open]'), id + ': disclosure open by default');
    }
    const linkedMarkup = menuTemplate.render({ attributes: attributes(), items: [{ title: 'Parent page', url: { path: '/parent', isRouted: true, routeName: 'entity.node.canonical' }, attributes: attributes(), below: [child] }] });
    const linkedMenu = parseHTML(linkedMarkup).document;
    assert(!linkedMenu.querySelector('details') && linkedMenu.querySelector('a')?.getAttribute('href') === '/parent' && linkedMenu.querySelector('ul ul a'), id + ': linked parent navigation changed');
    const walk = async (current) => {
      for (const entry of await fs.readdir(current, { withFileTypes: true })) {
        const file = path.join(current, entry.name);
        if (entry.isDirectory()) { await walk(file); continue; }
        if (file.endsWith('.css')) {
          const text = await fs.readFile(file, 'utf8');
          csstree.parse(text);
          for (const match of text.matchAll(/url\(['"]?([^'"()]+)['"]?\)/g)) {
            const url = match[1];
            assert(!/^https?:/.test(url), id + ': externally requested CSS asset');
            if (!url.startsWith('data:')) { await fs.access(path.resolve(path.dirname(file), url)); counts.fontAssets++; }
          }
          counts.css++;
        }
        if (file.endsWith('.js')) new vm.Script(await fs.readFile(file, 'utf8'));
        if (file.endsWith('.twig') && (file.includes(path.join('templates', 'design')) || file.endsWith(path.join('layout', 'page.html.twig')) || file.endsWith('menu--main.html.twig'))) {
          const text = await fs.readFile(file, 'utf8');
          assert(!text.includes('|raw'), id + ': unsafe raw markup in custom template');
          Twig.twig({ data: text, rethrow: true });
          counts.customTwig++;
        }
      }
    };
    await walk(dir);
    const page = await fs.readFile(path.join(dir, 'templates/layout/page.html.twig'), 'utf8');
    for (const region of Object.keys(info.regions)) assert(page.includes('page.' + region), id + ': unrendered region: ' + region);
    assert(page.includes('id="main-content"'), id + ': missing skip-link destination');
    const html = await fs.readFile(path.join(root, 'previews', id + '.html'), 'utf8');
    const { window, document } = parseHTML(html);
    assert(document.querySelector('main') && document.querySelector('h1'), id + ': invalid preview landmarks');
    for (const link of document.querySelectorAll('link[rel=stylesheet], script[src]')) await fs.access(path.resolve(root, 'previews', link.getAttribute('href') || link.getAttribute('src')));
    const marked = new WeakMap();
    const once = (key, selector, context) => Array.from(context.querySelectorAll(selector)).filter((el) => { const keys = marked.get(el) || new Set(); if (keys.has(key)) return false; keys.add(key); marked.set(el, keys); return true; });
    const scope = { Drupal: { behaviors: {} }, once, getComputedStyle: () => ({ direction: 'ltr' }), matchMedia: () => ({ matches: true }) };
    vm.runInNewContext(await fs.readFile(path.join(dir, 'js/design.js'), 'utf8'), scope);
    const attach = scope.Drupal.behaviors.designComponents.attach;
    attach(document); attach(document);
    const tabs = Array.from(document.querySelectorAll('[role=tab]'));
    if (tabs.length) {
      tabs[1].dispatchEvent(new window.Event('click'));
      assert(tabs[1].getAttribute('aria-selected') === 'true', id + ': tab click failed');
      const key = new window.Event('keydown'); Object.defineProperty(key, 'key', { value: 'End' }); tabs[0].dispatchEvent(key);
      assert(tabs.at(-1).getAttribute('aria-selected') === 'true', id + ': End key failed');
      assert(Array.from(document.querySelectorAll('[role=tabpanel]')).filter((panel) => !panel.hidden).length === 1, id + ': incorrect panel visibility');
      for (const tab of tabs) assert(document.getElementById(tab.getAttribute('aria-controls')), id + ': broken ARIA reference');
      const firstId = tabs[0].id; attach(document); assert(firstId === tabs[0].id, id + ': reattachment changed IDs');
      counts.tabSuites++;
    }
    // Two instances exercise unique ARIA IDs and independent selection.
    document.body.insertAdjacentHTML('beforeend', '<div class="design-tabs"><div data-tab-list><button data-tab>First</button><button data-tab>Second</button></div><section data-tab-panel>A</section><section data-tab-panel>B</section></div><div class="design-tabs"><div data-tab-list><button data-tab>First</button><button data-tab>Second</button></div><section data-tab-panel>C</section><section data-tab-panel>D</section></div><div class="design-carousel"><div class="design-carousel__track"><span>One</span><span>Two</span></div><button data-carousel-step="1" hidden>Next</button></div>');
    attach(document);
    const allIds = Array.from(document.querySelectorAll('[role=tab],[role=tabpanel]')).map((el) => el.id);
    assert(new Set(allIds).size === allIds.length, id + ': duplicate ARIA IDs');
    const carousel = document.querySelector('.design-carousel__track'); let movement;
    Object.defineProperty(carousel, 'clientWidth', { value: 300 }); carousel.scrollBy = (options) => { movement = options; };
    const next = document.querySelector('[data-carousel-step]'); assert(!next.hidden, id + ': controls did not enhance'); next.dispatchEvent(new window.Event('click'));
    assert(movement.left === 300 && movement.behavior === 'auto', id + ': carousel/reduced motion failed');
    counts.themes++;
  }
  console.log(JSON.stringify(counts, null, 2));
  return counts;
}

await validate(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));
