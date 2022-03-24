/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import { ReactComponent as LogoDesktop } from 'assets/img/v2/venusLogoWithText.svg';
import { ReactComponent as LogoNoText } from 'assets/img/v2/venusLogoPure.svg';
import { ReactComponent as LogoMobile } from 'assets/img/v2/venusLogoMobile.svg';
import { useWeb3Account } from 'clients/web3';
import { XvsCoinInfo, VaiCoinInfo } from '../CoinInfo';
import { TextButton } from '../../Button';
import { Toolbar } from '../Toolbar';
import { Icon } from '../../Icon';
import { useStyles } from './styles';
import { menuItems } from '../constants';
import ConnectButton from '../Header/ConnectButton';

export const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const open = Boolean(anchorEl);
  const { account } = useWeb3Account();

  const openMenu = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };
  const styles = useStyles({ expanded });
  return (
    <>
      <Drawer variant="permanent" anchor="left" css={styles.drawer}>
        <Toolbar css={styles.toolbar}>
          <TextButton onClick={() => setExpanded(!expanded)}>
            <LogoDesktop css={styles.logo} />
            <LogoNoText css={styles.logoClosed} />
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
      <div css={styles.mobileMenuBox}>
        <div css={styles.flexRow}>
          <LogoMobile css={styles.mobileLogo} />
          <button type="button" onClick={openMenu}>
            <Icon name="burger" css={styles.burger} />
          </button>
        </div>
        <Menu
          css={styles.mobileMenu}
          className="mobile-menu"
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={closeMenu}
          onClick={closeMenu}
          transitionDuration={0}
          marginThreshold={0}
          TransitionProps={{ style: { transition: 'background 0.2s linear' } }}
        >
          <div css={[styles.flexRow, styles.doublePadding]}>
            <LogoMobile css={styles.mobileLogo} />
            <button type="button" onClick={closeMenu}>
              <Icon name="close" css={styles.burger} />
            </button>
          </div>
          <div css={[styles.flexRow, styles.doublePadding, styles.coinInfo]}>
            {account ? (
              <>
                <XvsCoinInfo />
                <VaiCoinInfo />
              </>
            ) : (
              <ConnectButton />
            )}
          </div>
          <List css={styles.list}>
            {menuItems.map(({ href, icon, text }) => (
              <ListItemButton
                key={text}
                component="li"
                css={[styles.listItem, styles.mobileListItem]}
                disableRipple
              >
                <NavLink to={href} activeClassName="active-mobile-menu-item">
                  <div css={styles.mobileLabel}>
                    <ListItemIcon css={styles.listItemIcon}>
                      <Icon name={icon} />
                    </ListItemIcon>
                    <Typography
                      variant="body2"
                      component="span"
                      css={[styles.listItemText, styles.mobileListItemText]}
                    >
                      {text}
                    </Typography>
                  </div>
                  <Icon name="arrowRight" css={styles.mobileArrow} />
                </NavLink>
              </ListItemButton>
            ))}
          </List>
        </Menu>
      </div>
    </>
  );
};
