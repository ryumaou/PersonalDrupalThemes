# Branding

Drupal 11 theme adapted from [BrandingDesign.md](../../../DesignFiles/BrandingDesign.md) and the official Drupal 11.3.0 starterkit. Machine name: `branding`. Base theme: core Stable9, matching the starterkit generator output.

Black gallery wall, blood-red punctuation. See css/tokens.css for the full design token set.

## Install

Copy this entire directory into your Drupal web root at `themes/custom/branding`. In a Composer project this may be `web/themes/custom/branding`. Enable it under **Appearance**, set it as default, and rebuild caches. With Drush installed:

```sh
drush theme:enable branding
drush config:set system.theme default branding -y
drush cache:rebuild
```

## Configure content

Place blocks at **Structure → Block layout** for this theme. Header holds site branding, primary_menu holds the main menu, and secondary_menu holds action links. Hero accepts your introductory block; content holds the page title and main page content. Sidebar regions accept optional supporting blocks. Feature accepts additional sections and footer holds site links/contact. Status messages, breadcrumb and help are preserved. Sidebars collapse into a single column on small screens.

The theme does not create content types, nodes, menus, subscriptions, product screenshots or backend features. Drupal blocks and Views provide the content; the theme provides presentation. Preview sample content is isolated in the repository’s previews directory. A neutral theme wordmark is supplied; set your own site logo in Appearance. The unrelated upstream screenshot has been omitted.

## Components

Twig partials live in `templates/design`. Include them from a block, node or Views override using the theme namespace. Pass text strings for labels and Drupal render arrays for content/media; escaping is preserved. Do not pass untrusted HTML or mark user content raw. Example:

```twig
{% include '@branding/templates/design/card.html.twig' with {
  title: label,
  content: content,
  url: url,
  featured: false
} only %}
```

Hero takes title, eyebrow, description, content and actions (label/url/secondary). Card takes title, content, image, url, category and featured. Band takes title, eyebrow, content, action (label/url) and teal. Product-frame takes caption, image and content. Feature-split takes title, content and image. Project-list takes label and projects (title/url/content). Tabs takes label, tabs (label/content) and tinted; all panels are visible before JavaScript enhances them. Carousel takes an array of rendered items. Footer-grid takes groups (title/links with label/url). Feed-post takes author, date, title, avatar, body, actions and subscribe_url. Recommendation takes image, publication, title, url and metadata. Logo-marquee takes noninteractive logo render arrays; duplicated logos are hidden from assistive technology.

CSS utility classes include design-grid, design-actions, design-button, design-button--secondary, design-tag, eyebrow, metadata and prose. Add announcement for Branding launch badges, category-icon for Evernote feature icons, highlighter for Goodnotes text, and design-card--featured for a GitHub selected glass card. All twelve themes carry the same component API; choose components that fit this design.

## Fonts and tokens

Tokens are in css/tokens.css, local fonts in css/fonts.css and styling in css/design.css. Commercial brand fonts are not supplied. Open-license substitutes are bundled with OFL license files under fonts; Appearance does not download third-party fonts. To use an owned brand font, add a local @font-face rule using the family named in the design document. Substitute families are declared in css/fonts.css.

Written design constraints take precedence over inconsistent quick-start tokens. CSS range tokens use valid values. The menu loads linked and page-less parents’ dropdown children on every route, preserving configured depth, access checks, cache metadata, active-trail highlighting and corrected disclosure spacing and visibility. Rebuild caches after installing.

## Verification

See the repository VALIDATION.md and previews/index.html. Drupal runtime verification requires an installed Drupal site.

## Bundled typography

Inter substitutes Kmr Waldenburg; Playfair Display Italic substitutes Editorialnew. Commercial ornamental faces are not included. Fonts are served locally with OFL licenses.

## Main menu

Use `<nolink>` or `<button>` for page-less parents. Children appear even with Expanded unchecked when the block starts at level 1 and permits at least two levels. Native disclosures support click, touch, Enter and Space without JavaScript. Real URLs keep their links; both linked and page-less parents load dropdown children on every route. The preview demonstrates page-less, nested and linked parents.

### Dropdown availability

Main menu blocks starting at level 1 load enabled children for linked and page-less parents on every page. Set displayed levels to at least two (or Unlimited); a one-level block intentionally has no dropdown children. Menu access checks, sorting and active-trail highlighting remain in effect. Rebuild Drupal caches after replacing the theme files, including includes/navigation.inc.

### Menus placed in sidebar regions

Menu blocks in either sidebar use vertical lists with indented children. Linked parents show children on hover or keyboard focus. Main-menu page-less parents use native disclosures, closed initially, with one triangle. These styles target Drupal’s block-menu wrapper and do not require a site-navigation wrapper in the sidebar. The existing block depth/access settings still apply. Install the updated stylesheet and library definition, then rebuild caches. Design library version: 1.0.6.
