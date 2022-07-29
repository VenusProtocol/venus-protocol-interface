/** @jsxImportSource @emotion/react */
import React from 'react';
import { NavLink } from 'react-router-dom';

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
      <NavLink to={href} exact={href === '/'} onClick={onClick} activeClassName={activeClassName}>
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
