/** @jsxImportSource @emotion/react */
import React from 'react';
import { NavLink, matchPath } from 'react-router-dom';

import { MenuItem } from '../../types';

export interface LinkProps {
  href: MenuItem['href'];
  onClick?: () => void;
  isMobile?: boolean;
}

export const Link: React.FC<LinkProps> = ({ children, onClick, href, isMobile = false }) => {
  if (href[0] === '/') {
    const activeClassName = isMobile ? 'active-mobile-menu-item' : 'active-menu-item';

    return (
      <NavLink
        to={href}
        exact={href === '/'}
        isActive={(_match, location) => {
          // Handle home page
          if (location.pathname === '/' && href !== '/') {
            return false;
          }

          // Only match against the first part of the pathname since the sidebar
          // nav items represent the top level pages
          const formattedPathname = location.pathname.split('/').slice(0, 2).join('/');
          return !!matchPath(href, formattedPathname);
        }}
        onClick={onClick}
        activeClassName={activeClassName}
      >
        {children}
      </NavLink>
    );
  }

  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
};

export default Link;
