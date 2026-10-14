# Evernote

Drupal 11 theme adapted from [EvernoteDesign.md](../../../DesignFiles/EvernoteDesign.md) and the official Drupal 11.3.0 starterkit. Machine name: `evernote`. Base theme: core Stable9, matching the starterkit generator output.

Cream canvas, Figtree 300 display headings, flat white feature cards, dark CTAs on cream and lime CTAs on dark. Use carousel for horizontal feature cards. Limit lime to one prominent action or category icon per viewport.

## Install

Copy this entire directory into your Drupal web root at `themes/custom/evernote`. In a Composer project this may be `web/themes/custom/evernote`. Enable it under **Appearance**, set it as default, and rebuild caches. With Drush installed:

```sh
drush theme:enable evernote
drush config:set system.theme default evernote -y
drush cache:rebuild
```

## Configure content

Place blocks at **Structure → Block layout** for this theme. Header holds site branding, primary_menu holds the main menu, and secondary_menu holds action links. Hero accepts your introductory block; content holds the page title and main page content. Sidebar regions accept optional supporting blocks. Feature accepts additional sections and footer holds site links/contact. Status messages, breadcrumb and help are preserved. Sidebars collapse into a single column on small screens.

The theme does not create content types, nodes, menus, subscriptions, product screenshots or backend features. Drupal blocks and Views provide the content; the theme provides presentation. Preview sample content is isolated in the repository’s previews directory. A neutral theme wordmark is supplied; set your own site logo in Appearance. The unrelated upstream screenshot has been omitted.

## Components

Twig partials live in `templates/design`. Include them from a block, node or Views override using the theme namespace. Pass text strings for labels and Drupal render arrays for content/media; escaping is preserved. Do not pass untrusted HTML or mark user content raw. Example:

```twig
{% include '@evernote/templates/design/card.html.twig' with {
  title: label,
  content: content,
  url: url,
  featured: false
} only %}
```

Hero takes title, eyebrow, description, content and actions (label/url/secondary). Card takes title, content, image, url, category and featured. Band takes title, eyebrow, content, action (label/url) and teal. Product-frame takes caption, image and content. Feature-split takes title, content and image. Project-list takes label and projects (title/url/content). Tabs takes label, tabs (label/content) and tinted; all panels are visible before JavaScript enhances them. Carousel takes an array of rendered items. Footer-grid takes groups (title/links with label/url). Feed-post takes author, date, title, avatar, body, actions and subscribe_url. Recommendation takes image, publication, title, url and metadata. Logo-marquee takes noninteractive logo render arrays; duplicated logos are hidden from assistive technology.

CSS utility classes include design-grid, design-actions, design-button, design-button--secondary, design-tag, eyebrow, metadata and prose. Add announcement for Ghost launch badges, category-icon for Evernote feature icons, highlighter for Goodnotes text, and design-card--featured for a GitHub selected glass card. All eight themes carry the same component API; choose components that fit this design.

## Fonts and tokens

Tokens are in css/tokens.css, local fonts in css/fonts.css and styling in css/design.css. Commercial brand fonts are not supplied. Open-license substitutes are bundled with OFL license files under fonts; Appearance does not download third-party fonts. To use an owned brand font, add a local @font-face rule using the family named in the design document. Substitute families are declared in css/fonts.css.

Written design constraints take precedence over inconsistent quick-start tokens. Range values became valid CSS values/clamp expressions; Obsidian’s malformed surface color was corrected to #1e1e1e; the 14islands radius ceiling is 4px. Focus indicators, reduced-motion handling and responsive layouts are provided.

## Verification

Open the repository preview gallery for a sample-content view. See VALIDATION.md at the repository root for checks performed and remaining Drupal/browser checks. No running Drupal installation is available in this repository.

### Dropdown availability

Main menu blocks starting at level 1 load enabled children for linked and page-less parents on every page. Set displayed levels to at least two (or Unlimited); a one-level block intentionally has no dropdown children. Menu access checks, sorting and active-trail highlighting remain in effect. Rebuild Drupal caches after replacing the theme files, including includes/navigation.inc.
