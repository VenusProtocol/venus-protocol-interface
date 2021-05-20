import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'recompose';
import { connectAccount } from 'core';
import * as constants from 'utilities/constants';

const FooterWrapper = styled.div`
  height: 50px;
  padding: 26px 0px;
  background-color: var(--color-bg-main);
  display: flex;
  justify-content: flex-end;
  align-items: center;

  @media only screen and (max-width: 768px) {
    height: 100px;
    flex-direction: column;
    justify-content: center;
  }

  .status-circle {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: var(--color-dark-green);
    margin-right: 21px;
  }

  a {
    color: var(--color-text-footer);
    font-size: 14px;
    font-weight: 600;
    margin-right: 20px;
  }
`;

function Footer({ settings }) {
  if (!settings.selectedAddress) {
    return null;
  }
  return (
    <FooterWrapper>
      <div className="flex align-center">
        <div className="status-circle" target="_blank" rel="noreferrer" />
        <a
          href={process.env.REACT_APP_BSC_EXPLORER}
          target="_blank"
          rel="noreferrer"
        >
          Latest Block: {settings.latestBlockNumber || 0}
        </a>
      </div>
      <a
        href={`${process.env.REACT_APP_BSC_EXPLORER}/address/${constants.CONTRACT_XVS_TOKEN_ADDRESS}`}
        target="_blank"
        rel="noreferrer"
      >
        XVS
      </a>
      <a href="https://t.me/VenusProtocol" target="_blank" rel="noreferrer">
        Support
      </a>
      <a
        href="https://venus.io/Whitepaper.pdf"
        target="_blank"
        rel="noreferrer"
      >
        Whitepaper
      </a>
    </FooterWrapper>
  );
}

Footer.propTypes = {
  settings: PropTypes.object
};

Footer.defaultProps = {
  settings: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

export default compose(connectAccount(mapStateToProps, undefined))(Footer);
