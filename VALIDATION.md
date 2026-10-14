# Validation

## Four additional themes — October 14, 2026

Added Attio, Branding, Workflow and Writer with independent starterkit files, reference tokens, local licensed fonts, reusable Twig components and static previews. All four copy the latest selective main-menu expansion hook and native disclosure template, including corrected spacing and submenu visibility. Existing themes were left unchanged.

The complete scripts/validate.mjs function ran through Node with the pinned JS YAML, CSS Tree and Twig distributions and LinkeDOM 0.18.12's self-contained worker distribution. The shell tool could not initialize; npm was unavailable. Results: **12 themes, 1,692 upstream files, 228 custom Twig templates, 420 CSS files, 432 library assets, 411 CSS asset references and 9 preview tab suites passed**. Every theme also passed page-less parent and linked parent render checks, unique tab ID/repeated attachment checks, and carousel/reduced-motion checks.

Additional checks verified the four navigation hooks exactly match the existing Ghost hook after theme-name substitution, two closed nested disclosures per new preview, and resolved CSS custom-property references. Git diff --check passed. The provenance validator now checks unchanged upstream bytes before reversing substitutions, so ordinary upstream uses of the word branding do not cause false failures for the Branding machine name.

Fonts: Attio uses Inter / Inter Tight / Source Serif 4; Branding uses Inter / Playfair Display Italic; Workflow uses Crimson Pro / Inter / system Georgia; Writer uses Poppins / Spectral. OFL licenses accompany all bundled families. Branding's commercial ornamental display face is not supplied. Written Attio button constraints use 10px radius despite its contradictory prompt example; CSS range tokens are resolved to valid values.

**Browser layout review and PHP/Drupal runtime testing remain unverified.** Use the existing installation follow-up checklist and the updated preview gallery for those checks.

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

## Inline-image CSS correction

Updated all twelve design stylesheets and advanced each design library to version 1.0.1. The reported retained-upload image uses natural dimensions despite its 16-by-16 HTML attributes. Explicitly sized valid images remain sized, and Drupal replacement error icons and site logos are excluded from the recovery selector. Uploaded inline images receive responsive sizing, alignment spacing and mobile stacking.

All twelve selector fixtures passed (reported image, intentionally sized image, core error icon and logo), all changed CSS parsed, and library version checks passed. The complete validator also passed: 12 themes, 1,692 inherited files, 228 custom Twig templates, 420 CSS files, 432 library assets, 411 CSS asset references and 9 tab suites. These checks used the pinned parsers through Node as described above. Browser layout and Drupal runtime testing remain unverified. This is a display correction for retained URLs; it does not bypass Drupal filtering or repair missing files.

## Duplicate menu triangle correction

All twelve design stylesheets suppress list-style on primary-navigation list items. This overrides the starterkit expanded/collapsed list-style-image icons, including the RTL collapsed icon, while leaving the native summary disclosure marker intact. The rule covers nested menu items as well. Form details and menus outside primary navigation retain their existing styling. Design library versions advance to 1.0.2.

Added an assertion to scripts/validate.mjs for the primary-navigation marker reset. The full validator passed across all twelve themes with the existing menu render, CSS visibility/spacing, interaction and provenance checks. Git diff --check passed. Browser appearance and Drupal runtime verification remain pending.

## Linked-parent menu triangle correction

Narrowed the primary-navigation marker reset in all twelve themes to li:has(> details.menu-disclosure). Only list items with their own native disclosure lose the inherited image marker; linked expanded/collapsed parents, including linked parents nested inside disclosure groups, retain starterkit triangles and RTL variants. Design libraries advance to 1.0.3.

The validator now rejects blanket list-item suppression and checks a fixture with page-less, linked expanded, linked collapsed and nested linked parents. The reset matches only the page-less parent. Full validation passed across all twelve themes; git diff --check passed. Browser layout and Drupal runtime verification remain pending.

## Dropdown availability on unrelated routes

Updated all twelve navigation preprocessing hooks to clear the expandedParents loading restriction on root-level main-menu blocks that permit child levels. Both linked and page-less parents now load their enabled dropdown children independently of the current route or individual Expanded checkbox. Active-trail highlighting remains; configured maximum depth, access transformation, sorting and merged cache metadata remain in place. Lower-level blocks, single-level blocks and explicitly expanded core blocks retain their existing handling. Design library versions advance to 1.0.4.

The full structural/DOM validator passed for twelve themes, including menu marker and linked-parent rendering checks. All twelve hooks were checked for identical implementation after normalizing theme names. Git diff --check passed. PHP is not installed and no Drupal runtime is available, so actual off-route menu loading and PHP execution remain unverified here. Test a linked parent with Expanded unchecked from an unrelated route after deploying and rebuilding caches. This change supersedes earlier descriptions of selective page-less-only expansion.

## Substack sidebar menu correction

Added the missing site-navigation class to Substack’s primary-menu nav in the page template and static preview. Shared disclosure visibility and duplicate-marker suppression now apply in the sidebar. Sidebar-specific rules keep menus vertical, hide linked child lists by default, expose them on hover/focus, and place linked and disclosure submenus in normal document flow with indentation. Explicit sidebar visibility rules override the higher-specificity vertical-list display rule. Native disclosure markers remain, while linked-parent list markers are preserved. Substack’s design library advances to 1.0.5; other themes remain unchanged.

The preview now includes a linked parent and two closed nested page-less parents. Added validator checks for shared navigation wrappers in every page template and Substack sidebar layout/visibility and preview coverage. Full validation passed across all twelve themes. Git diff --check passed. Browser visual review and Drupal runtime validation remain pending.

## Sidebar menu blocks across all themes

Audited all twelve page layouts: Substack is the only default sidebar primary-menu layout; every theme exposes left/right sidebars for block placement. Added scoped block-menu CSS to each theme so sidebar menu blocks work without an enclosing site-navigation element. Lists stay vertical, child lists are hidden until hover/focus, closed page-less main-menu disclosures stay hidden, children remain in document flow with indentation, and only native disclosure parents suppress inherited triangles. Existing active-link colors are preserved. All design libraries advance to 1.0.6.

Added validation for sidebar layout/visibility and disclosure resets, and left/right fixtures containing page-less and linked parents plus a header-menu exclusion case. All twelve themes passed the full validator, including previous Substack, header navigation, interaction, Twig, asset and provenance checks. Git diff --check passed. Browser layout and PHP/Drupal runtime remain unverified.
