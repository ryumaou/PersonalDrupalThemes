/** Progressive enhancement for editorial tabs and feature carousels. */
(function (Drupal, once) {
  'use strict';
  let serial = 0;
  Drupal.behaviors.designComponents = {
    attach(context) {
      once('design-tabs', '.design-tabs', context).forEach((root) => {
        const list = root.querySelector('[data-tab-list]');
        const buttons = list ? Array.from(list.querySelectorAll('[data-tab]')) : [];
        const panels = Array.from(root.querySelectorAll('[data-tab-panel]'));
        if (!buttons.length || buttons.length !== panels.length) return;
        const prefix = 'design-tabs-' + (++serial);
        list.setAttribute('role', 'tablist');
        const select = (index, focus) => {
          buttons.forEach((button, i) => {
            button.setAttribute('aria-selected', String(i === index));
            button.tabIndex = i === index ? 0 : -1;
            panels[i].hidden = i !== index;
          });
          if (focus) buttons[index].focus();
        };
        buttons.forEach((button, index) => {
          button.id = prefix + '-tab-' + index;
          button.setAttribute('role', 'tab');
          button.setAttribute('aria-controls', prefix + '-panel-' + index);
          panels[index].id = prefix + '-panel-' + index;
          panels[index].setAttribute('role', 'tabpanel');
          panels[index].setAttribute('aria-labelledby', button.id);
          panels[index].tabIndex = 0;
          button.addEventListener('click', () => select(index, false));
          button.addEventListener('keydown', (event) => {
            const rtl = getComputedStyle(root).direction === 'rtl';
            let target;
            if (event.key === 'ArrowRight') target = (index + (rtl ? -1 : 1) + buttons.length) % buttons.length;
            if (event.key === 'ArrowLeft') target = (index + (rtl ? 1 : -1) + buttons.length) % buttons.length;
            if (event.key === 'Home') target = 0;
            if (event.key === 'End') target = buttons.length - 1;
            if (target !== undefined) { event.preventDefault(); select(target, true); }
          });
        });
        select(0, false);
      });
      once('design-carousel', '.design-carousel', context).forEach((root) => {
        const track = root.querySelector('.design-carousel__track');
        if (!track) return;
        root.querySelectorAll('[data-carousel-step]').forEach((button) => {
          button.hidden = false;
          button.addEventListener('click', () => {
            const rtl = getComputedStyle(track).direction === 'rtl';
            track.scrollBy({ left: track.clientWidth * Number(button.dataset.carouselStep) * (rtl ? -1 : 1), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
          });
        });
      });
    }
  };
})(Drupal, once);
