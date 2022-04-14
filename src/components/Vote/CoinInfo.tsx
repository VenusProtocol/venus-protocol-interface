import React from 'react';
import styled from 'styled-components';
import { Icon } from 'antd';
import { connectAccount } from 'core';
import { generateBscScanUrl } from 'utilities';
import coinImg from 'assets/img/coins/xvs.svg';
import { Card } from 'components/Basic/Card';
import { State } from 'core/modules/initialState';
import { formatCommaThousandsPeriodDecimal } from 'utilities/common';

const CardWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 25px;
  background-color: var(--color-bg-primary);
  padding: 37px 16px;

  img {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    margin-right: 16px;
  }

  p {
    font-size: 17.5px;
    font-weight: 900;
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

interface CoinInfoProps {
  address: string;
  balance: string;
}

function CoinInfo({ address, balance }: CoinInfoProps) {
  const handleLink = () => {
    window.open(generateBscScanUrl(address), '_blank');
  };

  return (
    <Card>
      <CardWrapper className="flex align-center just-between">
        <div className="flex align-center">
          <img src={coinImg} alt="coin" />
          <p>{formatCommaThousandsPeriodDecimal(balance)}</p>
        </div>
        {address ? (
          <div className="flex align-center just-center pointer" onClick={() => handleLink()}>
            <p className="highlight">
              {`${address.substr(0, 4)}...${address.substr(address.length - 4, 4)}`}
            </p>
            <div className="flex align-center just-center copy-btn">
              <Icon type="arrow-right" />
            </div>
          </div>
        ) : (
          ''
        )}
      </CardWrapper>
    </Card>
  );
}

CoinInfo.defaultProps = {
  address: '',
  balance: '0.0000',
};

const mapStateToProps = ({ account }: State) => ({
  settings: account.setting,
});

export default connectAccount(mapStateToProps)(CoinInfo);
