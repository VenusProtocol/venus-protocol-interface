import type { To } from 'react-router';

export const getPathname = (to: To) => (typeof to === 'string' ? to.split('?')[0] : to.pathname);
