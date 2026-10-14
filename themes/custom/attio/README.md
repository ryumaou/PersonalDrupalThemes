# Attio

Drupal 11 theme adapted from [AttioDesign.md](../../../DesignFiles/AttioDesign.md) and the official Drupal 11.3.0 starterkit. Machine name: `attio`. Base theme: core Stable9, matching the starterkit generator output.

Architectural editorial on white marble. See css/tokens.css for the full design token set.

## Install

Copy this entire directory into your Drupal web root at `themes/custom/attio`. In a Composer project this may be `web/themes/custom/attio`. Enable it under **Appearance**, set it as default, and rebuild caches. With Drush installed:

```sh
drush theme:enable attio
drush config:set system.theme default attio -y
drush cache:rebuild
```

## Configure content

Place blocks at **Structure → Block layout** for this theme. Header holds site branding, primary_menu holds the main menu, and secondary_menu holds action links. Hero accepts your introductory block; content holds the page title and main page content. Sidebar regions accept optional supporting blocks. Feature accepts additional sections and footer holds site links/contact. Status messages, breadcrumb and help are preserved. Sidebars collapse into a single column on small screens.

The theme does not create content types, nodes, menus, subscriptions, product screenshots or backend features. Drupal blocks and Views provide the content; the theme provides presentation. Preview sample content is isolated in the repository’s previews directory. A neutral theme wordmark is supplied; set your own site logo in Appearance. The unrelated upstream screenshot has been omitted.

## Components

Twig partials live in `templates/design`. Include them from a block, node or Views override using the theme namespace. Pass text strings for labels and Drupal render arrays for content/media; escaping is preserved. Do not pass untrusted HTML or mark user content raw. Example:

```twig
{% include '@attio/templates/design/card.html.twig' with {
  title: label,
  content: content,
  url: url,
  featured: false
} only %}
```

Hero takes title, eyebrow, description, content and actions (label/url/secondary). Card takes title, content, image, url, category and featured. Band takes title, eyebrow, content, action (label/url) and teal. Product-frame takes caption, image and content. Feature-split takes title, content and image. Project-list takes label and projects (title/url/content). Tabs takes label, tabs (label/content) and tinted; all panels are visible before JavaScript enhances them. Carousel takes an array of rendered items. Footer-grid takes groups (title/links with label/url). Feed-post takes author, date, title, avatar, body, actions and subscribe_url. Recommendation takes image, publication, title, url and metadata. Logo-marquee takes noninteractive logo render arrays; duplicated logos are hidden from assistive technology.

CSS utility classes include design-grid, design-actions, design-button, design-button--secondary, design-tag, eyebrow, metadata and prose. Add announcement for Attio launch badges, category-icon for Evernote feature icons, highlighter for Goodnotes text, and design-card--featured for a GitHub selected glass card. All twelve themes carry the same component API; choose components that fit this design.

## Fonts and tokens

Tokens are in css/tokens.css, local fonts in css/fonts.css and styling in css/design.css. Commercial brand fonts are not supplied. Open-license substitutes are bundled with OFL license files under fonts; Appearance does not download third-party fonts. To use an owned brand font, add a local @font-face rule using the family named in the design document. Substitute families are declared in css/fonts.css.

Written design constraints take precedence over inconsistent quick-start tokens. CSS range tokens use valid values. The inherited menu includes native disclosures for page-less parents, selective child expansion, configured depth, access checks, cache metadata, and the corrected disclosure spacing and visibility. Rebuild caches after installing.

## Verification

See the repository VALIDATION.md and previews/index.html. Drupal runtime verification requires an installed Drupal site.

## Bundled typography

Inter for UI, Inter Tight for display, and Source Serif 4 for TiemposText testimonial moments. Fonts are served locally with OFL licenses.

## Main menu

Use `<nolink>` or `<button>` for page-less parents. Children appear even with Expanded unchecked when the block starts at level 1 and permits at least two levels. Native disclosures support click, touch, Enter and Space without JavaScript. Real URLs keep their links and configured expansion. The preview demonstrates page-less, nested and linked parents.
