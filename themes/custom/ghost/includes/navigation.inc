<?php

/**
 * @file
 * Main navigation tree support.
 */

/**
 * Implements hook_preprocess_block().
 */
function ghost_preprocess_block(array &$variables): void {
  if (($variables['plugin_id'] ?? '') !== 'system_menu_block:main') {
    return;
  }

  $configuration = $variables['configuration'];
  // Preserve intentionally limited, active-trail-only and expand-all blocks.
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

  // Inspect enabled links, but retain the normal expansion list for rendering.
  $discovery_parameters = clone $parameters;
  $discovery_parameters->expandedParents = [];
  $discovery_tree = $menu_tree->load('main', $discovery_parameters);
  $additional_parents = [];
  $collect = function (array $tree) use (&$collect, &$additional_parents, $parameters): void {
    foreach ($tree as $element) {
      $url = $element->link->getUrlObject();
      $page_less = $url->isRouted() && in_array($url->getRouteName(), ['<nolink>', '<button>'], TRUE);
      $plugin_id = $element->link->getPluginId();
      if ($page_less && $element->subtree) {
        $additional_parents[] = $plugin_id;
      }
      // Do not expose descendants beneath a regular collapsed page link.
      if ($page_less || !$parameters->expandedParents || in_array($plugin_id, $parameters->expandedParents, TRUE)) {
        $collect($element->subtree);
      }
    }
  };
  $collect($discovery_tree);
  if (!$additional_parents) {
    return;
  }
  $parameters->addExpandedParents($additional_parents);
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
