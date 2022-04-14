import React from 'react';
import styled from 'styled-components';
import { Icon } from 'antd';
import { connectAccount } from 'core';

import { generateBscScanUrl } from 'utilities';
import { addToken, format } from 'utilities/common';
import coinImg from 'assets/img/coins/xvs.svg';
import { Card } from 'components/Basic/Card';
import { useWeb3Account } from 'clients/web3';
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

function CoinInfo() {
  const { account } = useWeb3Account();
  const { userXvsBalance } = useMarketsUser();

  const handleLink = () => {
    window.open(`${generateBscScanUrl('xvs', 'token')}?a=${account}`, '_blank');
  };

  return (
    <Card>
      <CardWrapper className="flex align-center just-between">
        <div className="flex align-center">
          <img src={coinImg} alt="coin" />
          <p>{format(userXvsBalance)} XVS</p>
          {window.ethereum && (
            <Icon
              className="add-xvs-token"
              type="plus-circle"
              theme="filled"
              onClick={() =>
                addToken({
                  asset: 'xvs',
                  decimal: 18,
                  type: 'token',
                })
              }
            />
          )}
        </div>
        <div className="flex align-center just-center pointer" onClick={() => handleLink()}>
          <p className="highlight">
            {account ? `${account.substr(0, 4)}...${account.substr(account.length - 4, 4)}` : ''}
          </p>
          <div className="flex align-center just-center copy-btn">
            <Icon type="arrow-right" />
          </div>
        </div>
      </CardWrapper>
    </Card>
  );
}

export default connectAccount()(CoinInfo);
