import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import { NavLink } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Drawer from '@mui/material/Drawer';
import { uid } from 'react-uid';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material';
import { ReactComponent as XVSIcon } from '../../../assets/img/xvs.svg';
import { ReactComponent as Logo } from './assets/logo.svg';

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

interface IProps {
  drawerWidth: number;
}

export const Sidebar = ({ drawerWidth }: IProps) => {
  const theme = useTheme();
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'center' }}>
        <NavLink to="/">
          <Logo />
        </NavLink>
      </Toolbar>

      <List sx={{ paddingTop: 10 }}>
        {menuItems.map(({ href, icon, text }) => (
          <ListItem
            key={uid(text)}
            button
            component={NavLink}
            to={href}
            activeStyle={{ color: theme.palette.primary.main }}
            sx={{
              transition: 'color .3s',
              color: 'inherit',
              pl: 3,
              pr: 3,
              '&+&': {
                mt: 2,
              },
              '&:hover': {
                color: theme.palette.primary.main,
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{icon}</ListItemIcon>
            <Typography variant="caption">{text}</Typography>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};
