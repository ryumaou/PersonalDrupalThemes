<?php

/**
 * @file
 * Main navigation tree support.
 */

/**
 * Implements hook_preprocess_block().
 */
function bpowell_preprocess_block(array &$variables): void {
  if (($variables['plugin_id'] ?? '') !== 'system_menu_block:main') {
    return;
  }

  $configuration = $variables['configuration'];
  // Preserve blocks starting below the root, single-level blocks and core expand-all.
  if ((int) ($configuration['level'] ?? 1) !== 1 || (int) ($configuration['depth'] ?? 0) === 1 || !empty($configuration['expand_all_items'])) {
    return;
  }

  $menu_tree = \Drupal::menuTree();
  $parameters = $menu_tree->getCurrentRouteMenuTreeParameters('main');
  $parameters->setMinDepth(1)->onlyEnabledLinks();
  $depth = (int) ($configuration['depth'] ?? 0);
  if ($depth > 0) {
    $parameters->setMaxDepth(min($depth, $menu_tree->maxDepth()));
  }

  // Load dropdown children on every route for both linked and page-less parents.
  // An empty expansion restriction loads the full enabled tree within maxDepth.
  // Keep activeTrail so Drupal can still highlight the current page.
  $parameters->expandedParents = [];
  $tree = $menu_tree->load('main', $parameters);
  $tree = $menu_tree->transform($tree, [
    ['callable' => 'menu.default_tree_manipulators:checkAccess'],
    ['callable' => 'menu.default_tree_manipulators:generateIndexAndSort'],
  ]);
  $content = $menu_tree->build($tree);
  \Drupal\Core\Cache\CacheableMetadata::createFromRenderArray($variables['content'])
    ->merge(\Drupal\Core\Cache\CacheableMetadata::createFromRenderArray($content))
    ->applyTo($content);
  $variables['content'] = $content;
}
