export const getEntryPathname = () => {
  const [pathname = ''] = window.location.hash.replace(/^#/, '').split('?');
  return pathname.replace(/\/$/, '') || '/';
};
