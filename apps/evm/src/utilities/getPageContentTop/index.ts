import { PAGE_CONTAINER_ID } from 'constants/layout';

export const getPageContentTop = () => {
  const pageContainer = document.getElementById(PAGE_CONTAINER_ID);

  if (!pageContainer) {
    return 0;
  }

  return (
    pageContainer.getBoundingClientRect().top +
    Number.parseFloat(window.getComputedStyle(pageContainer).paddingTop)
  );
};
