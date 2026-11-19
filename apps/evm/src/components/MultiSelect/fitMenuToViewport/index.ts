import { getPageContentTop } from 'utilities';

import { MENU_GAP_PX, MENU_MIN_HEIGHT_PX, MENU_VIEWPORT_MARGIN_PX } from '../constants';

// Places the menu below its trigger, or above it when there is not enough room below.
export const fitMenuToViewport = (node: HTMLDivElement | undefined) => {
  const menu = node?.closest<HTMLElement>('.venus-multiselect-menu');

  if (!node || !menu) {
    return;
  }

  const menuWrapper = menu.parentElement;
  const menuAnchor = menuWrapper?.parentElement;
  const trigger = menuAnchor?.parentElement;

  // Clear a previous placement above the trigger before measuring again.
  if (menuWrapper) {
    menuWrapper.style.top = '';
    menuWrapper.style.bottom = '';
    menuWrapper.style.paddingTop = '';
    menuWrapper.style.paddingBottom = '';
  }

  const spaceBelow =
    window.innerHeight - node.getBoundingClientRect().top - MENU_VIEWPORT_MARGIN_PX;

  const fitBelow = () => {
    node.style.maxHeight = `${Math.max(spaceBelow, MENU_MIN_HEIGHT_PX)}px`;
  };

  if (spaceBelow >= MENU_MIN_HEIGHT_PX || !menuWrapper || !menuAnchor || !trigger) {
    fitBelow();
    return;
  }

  const triggerTop = trigger.getBoundingClientRect().top;
  const spaceAbove = triggerTop - getPageContentTop() - MENU_GAP_PX * 2;

  if (spaceAbove <= spaceBelow) {
    fitBelow();
    return;
  }

  menuWrapper.style.top = 'auto';
  menuWrapper.style.bottom = `${menuAnchor.getBoundingClientRect().top - triggerTop}px`;
  menuWrapper.style.paddingTop = '0';
  menuWrapper.style.paddingBottom = `${MENU_GAP_PX}px`;
  node.style.maxHeight = `${spaceAbove}px`;
};
