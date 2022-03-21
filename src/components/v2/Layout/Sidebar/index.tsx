/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import { ReactComponent as LogoDesktop } from 'assets/img/v2/venusLogoWithText.svg';
import { ReactComponent as LogoMobile } from 'assets/img/v2/venusLogoPure.svg';
import { TextButton } from '../../Button';
import { Toolbar } from '../Toolbar';
import { Icon } from '../../Icon';
import { useStyles } from './styles';
import { menuItems } from '../constants';

export const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const styles = useStyles({ expanded });
  return (
    <Drawer variant="permanent" anchor="left" css={styles.drawer}>
      <Toolbar css={styles.toolbar}>
        <TextButton onClick={() => setExpanded(!expanded)}>
          <LogoDesktop css={styles.logo} />
          <LogoMobile css={styles.logoMobile} />
        </TextButton>
      </Toolbar>

      <List css={styles.list}>
        {menuItems.map(({ href, icon, text }) => (
          <ListItemButton key={text} component="li" css={styles.listItem} disableRipple>
            <NavLink to={href} activeClassName="active-menu-item">
              <ListItemIcon css={styles.listItemIcon}>
                <Icon name={icon} />
              </ListItemIcon>
              {expanded ? (
                <Typography variant="body2" css={styles.listItemText}>
                  {text}
                </Typography>
              ) : null}
              <div className="left-border" />
            </NavLink>
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};
