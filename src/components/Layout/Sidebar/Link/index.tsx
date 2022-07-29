/** @jsxImportSource @emotion/react */
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { MenuItem } from '../../types';

export interface LinkProps {
  href: MenuItem['href'];
  onClick?: () => void;
  isMobile?: boolean;
}

export const Link: React.FC<LinkProps> = ({ children, onClick, href, isMobile = false }) => {
  const { pathname } = useLocation();
  if (href[0] === '/') {
    const activeClassName = isMobile ? 'active-mobile-menu-item' : 'active-menu-item';
    return (
      <NavLink
        to={href}
        onClick={onClick}
        activeClassName={activeClassName}
        isActive={() => href === pathname}
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
