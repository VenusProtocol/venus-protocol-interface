import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon } from 'antd';
import { compose } from 'recompose';
import { connectAccount } from 'core';
import commaNumber from 'comma-number';
import coinImg from 'assets/img/coins/vai.svg';
import { Card } from 'components/Basic/Card';
import { addToken } from 'utilities/common';
import { useWeb3React } from '@web3-react/core';
import { BASE_BSC_SCAN_URL } from '../../config';
import { useVaiUser } from '../../hooks/useVaiUser';
import { getVaiTokenAddress } from '../../utilities/addressHelpers';

const CardWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 25px;
  background-color: var(--color-bg-primary);
  padding: 37px 16px;

  .add-vai-token {
    font-size: 18px;
    color: var(--color-green);
    margin-left: 10px;
    margin-bottom: 3px;
  }

  img {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    margin-right: 16px;
  }

  p {
    font-size: 17.5px;
    font-weight: 900;
    line-height: 1;
    color: var(--color-text-main);
  }

  .vai-apy {
    margin-left: 10px;
    color: var(--color-green);
    font-size: 16px;
  }

  .copy-btn {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: var(--color-bg-active);
    margin-left: 26px;

    i {
      color: var(--color-text-main);
      svg {
        transform: rotate(-45deg);
      }
    }
  }
`;

const format = commaNumber.bindWith(',', '.');

function VaiInfo({ settings }) {
  const { account } = useWeb3React();
  const { userVaiBalance } = useVaiUser();
  const handleLink = () => {
    window.open(
      `${BASE_BSC_SCAN_URL}/token/${getVaiTokenAddress()}?a=${account}`,
      '_blank'
    );
  };

  return (
    <Card>
      <CardWrapper className="flex align-center just-between">
        <div className="flex align-center">
          <img src={coinImg} alt="coin" />
          <p>{format(userVaiBalance.dp(2, 1).toString(10))} VAI </p>
          {(window.ethereum || window.BinanceChain) && (
            <Icon
              className="add-vai-token"
              type="plus-circle"
              theme="filled"
              onClick={() => addToken('vai', 18, 'token')}
            />
          )}
          {settings.vaiAPY && (
            <p className="vai-apy">APY: {settings.vaiAPY}%</p>
          )}
        </div>
        <div
          className="flex align-center just-center pointer"
          onClick={() => handleLink()}
        >
          <p className="highlight">
            {account
              ? `${account.substr(0, 4)}...${account.substr(
                  account.length - 4,
                  4
                )}`
              : ''}
          </p>
          <div className="flex align-center just-center copy-btn">
            <Icon type="arrow-right" />
          </div>
        </div>
      </CardWrapper>
    </Card>
  );
}

VaiInfo.propTypes = {
  settings: PropTypes.object
};

VaiInfo.defaultProps = {
  settings: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

export default compose(connectAccount(mapStateToProps, undefined))(VaiInfo);
