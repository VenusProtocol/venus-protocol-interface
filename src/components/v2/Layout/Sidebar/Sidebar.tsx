/** @jsxImportSource @emotion/react */
import React from 'react';
import { NavLink } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Drawer from '@mui/material/Drawer';
import { uid } from 'react-uid';
import Typography from '@mui/material/Typography';
import { Toolbar } from '../Toolbar';
import { ReactComponent as XVSIcon } from '../../../../assets/img/xvs.svg';
import { ReactComponent as Logo } from '../assets/logo.svg';
import { useStyles } from './styles';

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

export const Sidebar = () => {
  const styles = useStyles();
  return (
    <Drawer css={styles.drawer} variant="permanent" anchor="left">
      <Toolbar css={styles.toolbar}>
        <NavLink to="/">
          <Logo />
        </NavLink>
      </Toolbar>

      <List css={styles.list}>
        {menuItems.map(({ href, icon, text }) => (
          <ListItem
            key={uid(text)}
            button
            component={NavLink}
            to={href}
            activeStyle={styles.activeMenuItem}
            css={styles.listItem}
          >
            <ListItemIcon css={styles.listItemIcon}>{icon}</ListItemIcon>
            <Typography variant="caption">{text}</Typography>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};
