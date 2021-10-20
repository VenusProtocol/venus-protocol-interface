import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon } from 'antd';
import { compose } from 'recompose';
import { connectAccount } from 'core';
import commaNumber from 'comma-number';
import * as constants from 'utilities/constants';
import { addToken } from 'utilities/common';
import coinImg from 'assets/img/venus_32.png';
import { Card } from 'components/Basic/Card';
import { BASE_BSC_SCAN_URL } from '../../config';
import { useWeb3React } from '@web3-react/core';
import { useMarketsUser } from '../../hooks/useMarketsUser';

const CardWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 25px;
  background-color: var(--color-bg-primary);
  padding: 37px 16px;

  .add-xvs-token {
    font-size: 18px;
    color: var(--color-yellow);
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

function CoinInfo({ settings }) {
  const { account } = useWeb3React();
  const { userXVSBalance } = useMarketsUser();

  const handleLink = () => {
    window.open(
      `${BASE_BSC_SCAN_URL}/token/${constants.CONTRACT_TOKEN_ADDRESS.xvs.address}?a=${account}`,
      '_blank'
    );
  };

  return (
    <Card>
      <CardWrapper className="flex align-center just-between">
        <div className="flex align-center">
          <img src={coinImg} alt="coin" />
          <p>{format(userXVSBalance.dp(2, 1).toString(10))} XVS</p>
          {window.ethereum && (
            <Icon
              className="add-xvs-token"
              type="plus-circle"
              theme="filled"
              onClick={() => addToken('xvs', 18, 'token')}
            />
          )}
        </div>
        <div
          className="flex align-center just-center pointer"
          onClick={() => handleLink()}
        >
          <p className="highlight">
            {account &&
              `${account.substr(0, 4)}...${account.substr(
                account.length - 4,
                4
              )}`}
          </p>
          <div className="flex align-center just-center copy-btn">
            <Icon type="arrow-right" />
          </div>
        </div>
      </CardWrapper>
    </Card>
  );
}

CoinInfo.propTypes = {
  settings: PropTypes.object
};

CoinInfo.defaultProps = {
  settings: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

export default compose(connectAccount(mapStateToProps, undefined))(CoinInfo);
