import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Icon } from 'antd';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
import { Card } from 'components/Basic/Card';
import coinImg from 'assets/img/coins/xvs.svg';
import BigNumber from 'bignumber.js';
import { Asset } from 'types';
import { generateBscScanUrl } from 'utilities';
import { formatCommaThousandsPeriodDecimal } from 'utilities/common';
import { useMarketsUser } from 'hooks/useMarketsUser';
import { useComptrollerContract, useVenusLensContract } from 'clients/contracts/hooks';
import { AuthContext } from 'context/AuthContext';

const VotingWalletWrapper = styled.div`
  width: 100%;
  border-radius: 25px;
  background-color: var(--color-bg-primary);
  padding: 36px 18px 16px 18px;

  .header {
    padding-left: 35px;
    margin-bottom: 20px;
    .title {
      font-size: 17px;
      font-weight: 900;
      color: var(--color-text-main);
    }
  }

  .content-border-bottom {
    border-bottom: 1px solid var(--color-bg-active);
  }

  .content {
    padding: 20px 0;

    img {
      width: 25px;
      height: 25px;
      border-radius: 50%;
      margin-right: 9px;
    }

    a,
    p {
      font-size: 16px;
      font-weight: bold;
      color: var(--color-orange);
    }

    .content-label {
      padding-left: 35px;
      font-size: 16px;
      color: var(--color-text-secondary);
    }

    .content-value {
      font-size: 28.5px;
      font-weight: 900;
      color: var(--color-text-main);
    }
  }
  .delegate-change {
    padding-left: 35px;
    .content-label {
      padding-left: 0;
    }
    .change {
      font-size: 16px;
      font-weight: bold;
      color: var(--color-orange);
    }
  }

  span {
    color: var(--color-orange);
  }

  .mint-content-label {
    margin-top: 20px;
    padding-left: 35px;
    font-weight: 900;
    font-size: 16px;
    color: var(--color-text-secondary);
  }
`;

interface VotingWalletProps {
  balance: string;
  earnedBalance: string;
  vaiMint: string;
  delegateAddress: string;
  delegateStatus: string;
}

function VotingWallet({
  balance,
  earnedBalance,
  vaiMint,
  delegateAddress,
  delegateStatus,
}: VotingWalletProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEarn, setIsLoadingEarn] = useState(false);
  const { account } = useContext(AuthContext);
  const { userMarketInfo } = useMarketsUser();
  const comptrollerContract = useComptrollerContract();
  const venusLensContract = useVenusLensContract();

  useEffect(() => {
    if (!earnedBalance) {
      setIsLoadingEarn(true);
      return;
    }
    setIsLoadingEarn(false);
  }, [earnedBalance]);

  const handleCollect = async () => {
    if (!account) {
      console.error('Cannot collect Venus tokens: ', 'account undefined');
      return;
    }

    // filter out tokens that users have positive balance to save gas cost by 'claimVenus'
    const vTokensBalanceInfos = await venusLensContract.methods
      .vTokenBalancesAll(
        userMarketInfo.map((asset: Asset) => asset.vtokenAddress),
        account.address,
      )
      .call();

    const outstandingVTokens = vTokensBalanceInfos.filter(
      (info: $TSFixMe) =>
        // info[2]: borrowBalanceCurrent, info[3]: balanceOfUnderlying
        new BigNumber(info[2]).gt(0) || new BigNumber(info[3]).gt(0),
    );

    // const t = (await this.venusLens.vTokenBalancesAll(this.vBep20Delegator.vTokenWithMetadataAll.map(t=>t.address), this.address)).filter(t=>t.balanceOfUnderlying.gt(0) || t.borrowBalanceCurrent.gt(0)).map(t=>t.address)
    if (+earnedBalance !== 0 || +vaiMint !== 0) {
      setIsLoading(true);
      try {
        await comptrollerContract.methods['claimVenus(address,address[])'](
          account.address,
          outstandingVTokens.map((token: $TSFixMe) => token[0]),
        ).send({ from: account.address });
      } catch (error) {
        console.log('claim venus error :>> ', error);
      }
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <VotingWalletWrapper>
        <div className="flex align-center header">
          <p className="title">Voting Wallet</p>
        </div>
        <div className="flex flex-column content content-border-bottom">
          <p className="content-label">Venus Balance</p>
          <div className="flex align-center just-between">
            <div className="flex align-center">
              <img src={coinImg} alt="coin" />
              <p className="content-value">{formatCommaThousandsPeriodDecimal(balance)}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-column content">
          {isLoadingEarn && <LoadingSpinner />}
          {!isLoadingEarn && (
            <div className="flex align-center just-between">
              <div className="flex flex-column">
                <p className="content-label">Venus Earned</p>
                <div className="flex align-center">
                  <img src={coinImg} alt="coin" />
                  <p className="content-value">
                    {formatCommaThousandsPeriodDecimal(earnedBalance)}
                  </p>
                </div>
                <div className="mint-content-label">VAI Mint Earned</div>
                <div className="flex align-center">
                  <img src={coinImg} alt="coin" />
                  <p className="content-value">{formatCommaThousandsPeriodDecimal(vaiMint)}</p>
                </div>
              </div>
              {account && (
                <div className="flex align-center">
                  <p className="pointer" onClick={handleCollect}>
                    {isLoading && <Icon type="loading" />} Collect
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        {delegateStatus && (
          <div className="flex flex-column content delegate-change">
            <p className="content-label">Delegating To</p>
            <div className="flex align-center just-between">
              <div className="flex align-center">
                <a
                  className="content-value"
                  href={generateBscScanUrl(delegateAddress)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {delegateStatus === 'self'
                    ? 'Self'
                    : `${delegateAddress.substr(0, 4)}...${delegateAddress.substr(
                        delegateAddress.length - 4,
                        4,
                      )}`}
                </a>
              </div>
              <div className="flex align-center">
                <p className="change pointer">Change</p>
              </div>
            </div>
          </div>
        )}
      </VotingWalletWrapper>
    </Card>
  );
}

export default VotingWallet;
