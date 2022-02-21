import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import { NavLink } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Drawer from '@mui/material/Drawer';
import { uid } from 'react-uid';
import Typography from '@mui/material/Typography';
import { ReactComponent as XVSIcon } from '../../../assets/img/xvs.svg';
import { ReactComponent as Logo } from './assets/logo.svg';
import styles from './Sidebar.module.scss';

const menuItems = [
  {
    href: '/dashboard',
    text: 'Dashboard',
    icon: <XVSIcon width={20} height={20} />,
  },
  {
    href: '/vote',
    text: 'Vote',
    icon: <XVSIcon width={20} height={20} />,
  },
  {
    href: '/xvs',
    text: 'XVS',
    icon: <XVSIcon width={20} height={20} />,
  },
  {
    href: '/market',
    text: 'Market',
    icon: <XVSIcon width={20} height={20} />,
  },
  {
    href: '/vault',
    text: 'Vault',
    icon: <XVSIcon width={20} height={20} />,
  },
  {
    href: '/transaction',
    text: 'Transaction history',
    icon: <XVSIcon width={20} height={20} />,
  },
  {
    href: '/dev',
    text: 'Dev',
    icon: <XVSIcon width={20} height={20} />,
  },
];

export const Sidebar = () => (
  <Drawer
    className={styles.drawer}
    classes={{
      paper: styles.paper,
    }}
    variant="permanent"
    anchor="left"
  >
    <Toolbar className={styles.toolbar}>
      <NavLink to="/">
        <Logo />
      </NavLink>
    </Toolbar>

    <List className={styles.list}>
      {menuItems.map(({ href, icon, text }) => (
        <ListItem
          key={uid(text)}
          button
          component={NavLink}
          to={href}
          activeClassName={styles.listItemActive}
          className={styles.listItem}
        >
          <ListItemIcon className={styles.listItemIcon}>{icon}</ListItemIcon>
          <Typography variant="caption">{text}</Typography>
        </ListItem>
      ))}
    </List>
  </Drawer>
);
