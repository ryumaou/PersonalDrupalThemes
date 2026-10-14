# Personal Drupal Themes

Twelve independent Drupal 11 themes based on the style references in DesignFiles. Each includes the actual Drupal 11.3.0 core starterkit templates, CSS, icons and preprocessing hook, renamed and configured like generated themes, then extended with its own design. The core Stable9 base theme is retained, as in the official starterkit. No theme depends on another theme in this repository.

| Design document | Theme | Machine name |
| --- | --- | --- |
| [AttioDesign.md](DesignFiles/AttioDesign.md) | Attio | [attio](themes/custom/attio) |
| [BrandingDesign.md](DesignFiles/BrandingDesign.md) | Branding | [branding](themes/custom/branding) |
| [WorkflowDesign.md](DesignFiles/WorkflowDesign.md) | Workflow | [workflow](themes/custom/workflow) |
| [WriterDesign.md](DesignFiles/WriterDesign.md) | Writer | [writer](themes/custom/writer) |
| [14IslandsDesign.md](DesignFiles/14IslandsDesign.md) | 14islands | [fourteen_islands](themes/custom/fourteen_islands) |
| [BPowellDeisgn.md](DesignFiles/BPowellDeisgn.md) | Bpowell | [bpowell](themes/custom/bpowell) |
| [EvernoteDesign.md](DesignFiles/EvernoteDesign.md) | Evernote | [evernote](themes/custom/evernote) |
| [GhostDesign.md](DesignFiles/GhostDesign.md) | Ghost | [ghost](themes/custom/ghost) |
| [GitHubDesign.md](DesignFiles/GitHubDesign.md) | GitHub | [github](themes/custom/github) |
| [GoodnoetsDesign.md](DesignFiles/GoodnoetsDesign.md) | Goodnotes | [goodnotes](themes/custom/goodnotes) |
| [ObsidianDesign.md](DesignFiles/ObsidianDesign.md) | Obsidian | [obsidian](themes/custom/obsidian) |
| [SubstackDesgin.md](DesignFiles/SubstackDesgin.md) | Substack | [substack](themes/custom/substack) |

The numeric title 14islands uses the valid PHP-friendly machine name fourteen_islands. Names come from document headings rather than filenames, including the source filenames with spelling errors.

## Install

Copy any desired directory from themes/custom into the matching themes/custom directory in your Drupal web root (often web/themes/custom in Composer installations). Enable it and set it as default under Appearance. Rebuild Drupal caches after changing templates or library definitions. Example with Drush:

```sh
drush theme:enable obsidian
drush config:set system.theme default obsidian -y
drush cache:rebuild
```

Each theme’s README explains regions, reusable Twig components and font choices. Place site branding, menus, status messages, page title and main content through Structure → Block layout for the selected theme. Add your own Hero, Feature, sidebar and footer blocks. Content types, media, Views, authentication, search and subscription functionality belong to the Drupal site and are not created by a theme.

## Main menu subitems

Main menu blocks starting at level 1 include children of page-less parents even when those parents are not marked Expanded. Regular page links keep Drupal’s configured expansion and active-trail behavior. Configured menu depth remains respected; a block limited to one level still shows only that level. Set its displayed levels to Unlimited (or at least two) to show subitems.

Use Drupal's `<nolink>` or `<button>` destination for a parent that has no page. Parents with visible children use a native disclosure that opens with click, touch, Enter or Space, including when JavaScript is unavailable. Parents with real URLs retain their links. Rebuild Drupal caches after installing these changes.

## Preview

Open [previews/index.html](previews/index.html) in a browser. The preview pages use the exact theme CSS and JavaScript with clearly labeled sample content; they do not require Drupal or a build step. For a local HTTP preview with Node installed:

```sh
node scripts/preview.mjs
```

Then open http://127.0.0.1:8765/previews/index.html. Preview forms demonstrate presentation only. Replace product-frame samples with your own screenshots and gallery placeholders with commissioned photography. No brand/product screenshots or commercial font files were provided in DesignFiles. Open-license font substitutes are served locally and their licenses are included.

## Starterkit source

There is no Drupal installation or vendor/bin/dr executable in this repository, so the generator could not be executed here. Equivalent baseline files were copied from the pinned official 11.3.0 release, with generator substitutions and metadata applied. This is a reproducible source snapshot, not a claim that the generator ran. The equivalent command in an installed Drupal project is:

```sh
exec vendor/bin/dr generate-theme obsidian --name "Obsidian" --path themes/custom
```

Older Drupal 11 installations use php core/scripts/drupal generate-theme with the same arguments. See the [official starterkit guide](https://www.drupal.org/docs/core-modules-and-themes/core-themes/starterkit-theme). The generated theme metadata records starterkit_theme:11.3.0. [starterkit-provenance.json](starterkit-provenance.json) records the source URL and SHA-256 hashes; [LICENSE.txt](LICENSE.txt) contains the upstream Drupal GPL license.

## Checks

With Node 20+ and npm installed:

```sh
npm install
npm run validate
```

The validation command parses YAML and CSS, checks local library/font assets, compiles custom Twig templates, verifies renamed upstream files against provenance, and exercises click/keyboard/ARIA/repeated attachment behavior using a DOM implementation. See [VALIDATION.md](VALIDATION.md) for executed checks and required Drupal/browser follow-up.
