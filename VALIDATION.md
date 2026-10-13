# Validation

The repository has no Drupal installation, Composer vendor directory, PHP executable, or browser exposed to the browser automation tool. The themes were built using the official pinned Drupal 11.3.0 starterkit source and verified structurally. The native shell tool failed to initialize; filesystem work and validation were completed through Node instead.

## Executed checks

- All 8 metadata YAML files and all 8 library YAML files parse. Each theme declares ^11, Stable9, its generated name, its provenance, and its own design library.
- 1,128 inherited files match the upstream SHA-256 hashes after reversing generator name substitutions. This covers core templates (including Drupal translation tags), CSS, icons and the image-widget preprocessing hook.
- 144 custom Twig templates compile with Twig.js. This is a syntax check, not a PHP Twig/Drupal render. No custom template uses raw output.
- 280 CSS files parse with CSS Tree. All 288 library asset paths and 266 local CSS URL references resolve, including bundled fonts and inherited icons.
- Theme JavaScript passes Node syntax parsing.
- DOM integration checks passed for all 8 behavior files. Five preview tab suites verify click selection, End-key navigation, one visible panel, valid ARIA references and repeated attachment. Two additional tab instances in every theme verify unique IDs; carousel checks verify controls, movement and reduced-motion behavior.
- Each declared page region is rendered and each page has a main-content skip-link destination. Preview HTML has main/headline landmarks and valid local CSS/JavaScript references.

The same checks can be rerun using npm install followed by npm run validate. During this session, the exact pinned parser distributions were loaded from npm’s distribution CDN and the same validator function ran using those parsers and LinkeDOM. No npm/PHP/Drupal commands are claimed to have run.

## Follow-up in a Drupal installation

1. Copy a theme into your Drupal 11 web root, enable it, set it as default and rebuild caches.
2. Place branding, menus, status messages, title, main content, hero, feature, sidebars and footer blocks through Block layout.
3. Review front page, full node, teaser/View, menu sublevels, search, forms, validation messages, comments and authenticated contextual links. Verify Twig includes against Drupal PHP Twig.
4. Review desktop, tablet and mobile widths in a browser. Check long headings, full-width media, optional/empty sidebars, focus visibility, keyboard tabs, reduced motion, RTL and text zoom.
5. Replace preview image placements with your own media and configure any real subscription/search/backend behavior in Drupal modules.

Visual review and Drupal runtime installation remain unverified. Static previews are supplied in previews/index.html for that review.

## Main menu regression checks

The navigation fix was checked across all eight themes: 24 Twig render cases cover page-less parents (both <nolink> and <button>) and parents with real page URLs, each with a child link. All eight changed design CSS files parsed, all eight behavior scripts passed syntax checks, and all 1,128 inherited source prefixes/files retained their upstream hashes. The .theme files now append an include for custom navigation; the validator checks the original prefix against provenance. These checks ran through Node using the pinned Twig and CSS Tree distributions. The full npm validator was not run in this session because the shell could not initialize and local dependencies are absent.

In Drupal, verify a main-menu parent with <nolink>, Expanded unchecked, and two enabled child pages from an unrelated route. Check both anonymous and authenticated access, cache rebuilds and menu edits, a real-URL parent, disabled/restricted children, nested submenus, and configured depth limits. Test disclosure controls by mouse, touch, Tab, Enter and Space at desktop and mobile widths. PHP/Drupal runtime and browser layout verification remain pending.

### Alignment and expansion correction

Removed inherited details margins/border and summary padding from navigation disclosures, and applied each theme’s link typography to summary labels. Increased the regular submenu hiding selector’s specificity so the nested-menu display rule cannot leave submenus visible. Closed disclosures explicitly hide their child lists.

Replaced blanket expand-all rebuilding with the current-route menu parameters plus only the reachable <nolink>/<button> parent IDs. Regular page links retain their configured expansion/active-trail behavior; disabled links, access checks, sorting, configured depth and cache metadata are preserved. The block’s explicitly enabled Expand all items setting remains respected.

All eight changed CSS files parse and pass the new spacing/visibility assertions in scripts/validate.mjs. All 24 Twig menu cases pass, including closed-by-default disclosures, and 1,128 inherited files/prefixes still match provenance. Validator syntax also passes. PHP is unavailable (php executable not found), so the selective tree hook and actual browser layout still need Drupal runtime verification. The complete npm validator was not run.
