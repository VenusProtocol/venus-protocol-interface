import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'recompose';
import { Icon } from 'antd';
import { connectAccount } from 'core';
import Button from '@material-ui/core/Button';
import commaNumber from 'comma-number';
import { getComptrollerContract, methods } from 'utilities/ContractService';
import DelegationTypeModal from 'components/Basic/DelegationTypeModal';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
import { Card } from 'components/Basic/Card';
import coinImg from 'assets/img/venus_32.png';

const VotingWalletWrapper = styled.div`
  width: 100%;
  border-radius: 25px;
  background-color: var(--color-bg-primary);
  padding: 36px 22px 48px 15px;

  .header {
    padding-left: 35px;
    margin-bottom: 20px;
    .title {
      font-size: 17px;
      font-weight: 900;
      color: var(--color-text-main);
    }
  }

  .content {
    padding: 20px 0px;
    border-bottom: 1px solid var(--color-bg-active);

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
      padding-left: 0px;
    }
    .change {
      font-size: 16px;
      font-weight: bold;
      color: var(--color-orange);
    }
  }
  .setup {
    padding: 30px 35px 0px;

    .setup-header {
      font-size: 18px;
      font-weight: 900;
      color: var(--color-text-main);
    }

    .setup-content {
      margin-top: 32px;
      font-size: 16px;
      color: var(--color-text-secondary);

      a {
        color: var(--color-orange);
      }
    }
  }

  .started-btn {
    margin-top: 30px;
    width: 50%;
    height: 46px;
    border-radius: 5px;
    background-image: linear-gradient(to right, #f2c265, #f7b44f);
    .MuiButton-label {
      font-size: 13px;
      font-weight: 500;
      color: var(--color-text-main);
      text-transform: capitalize;
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

const format = commaNumber.bindWith(',', '.');

function VotingWallet({
  balance,
  settings,
  earnedBalance,
  vaiMint,
  delegateAddress,
  delegateStatus
}) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEarn, setIsLoadingEarn] = useState(false);

  useEffect(() => {
    if (!earnedBalance) {
      setIsLoadingEarn(true);
      return;
    }
    setIsLoadingEarn(false);
  }, [earnedBalance]);

  const getBefore = value => {
    const position = value.indexOf('.');
    return position !== -1 ? value.slice(0, position + 5) : value;
  };

  const getAfter = value => {
    const position = value.indexOf('.');
    return position !== -1 ? value.slice(position + 5) : null;
  };

  const handleCollect = () => {
    if (+earnedBalance !== 0 || +vaiMint !== 0) {
      setIsLoading(true);
      const appContract = getComptrollerContract();
      methods
        .send(
          appContract.methods.claimVenus,
          [settings.selectedAddress],
          settings.selectedAddress
        )
        .then(() => {
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <Card>
      <VotingWalletWrapper>
        <div className="flex align-center header">
          <p className="title">Voting Wallet</p>
        </div>
        <div className="flex flex-column content">
          <p className="content-label">Venus Balance</p>
          <div className="flex align-center just-between">
            <div className="flex align-center">
              <img src={coinImg} alt="coin" />
              <p className="content-value">
                {getBefore(format(balance))}
                <span>{getAfter(format(balance))}</span>
              </p>
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
                    {getBefore(format(earnedBalance))}
                    <span>{getAfter(format(earnedBalance))}</span>
                  </p>
                </div>
                <div className="mint-content-label">VAI Mint Earned</div>
                <div className="flex align-center">
                  <img src={coinImg} alt="coin" />
                  <p className="content-value">
                    {getBefore(format(vaiMint))}
                    <span>{getAfter(format(vaiMint))}</span>
                  </p>
                </div>
              </div>
              {settings.selectedAddress && (
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
                  href={`${process.env.REACT_APP_BSC_EXPLORER}/address/${delegateAddress}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {delegateStatus === 'self'
                    ? 'Self'
                    : `${delegateAddress.substr(
                        0,
                        4
                      )}...${delegateAddress.substr(
                        delegateAddress.length - 4,
                        4
                      )}`}
                </a>
              </div>
              <div className="flex align-center">
                <p
                  className="change pointer"
                  onClick={() => setIsOpenModal(true)}
                >
                  Change
                </p>
              </div>
            </div>
          </div>
        )}
        {settings.selectedAddress && !delegateStatus && (
          <div className="flex flex-column setup">
            <p className="setup-header">Setup Voting</p>
            <p className="setup-content">
              You can either vote on each proposal yourself or delegate your
              votes to a third party. Venus Governance puts you in charge of the
              future of Venus.
              {/* <a href="/#">Learn more.</a> */}
            </p>
          </div>
        )}
        {settings.selectedAddress && !delegateStatus && (
          <div className="center footer">
            <Button
              className="started-btn"
              onClick={() => setIsOpenModal(true)}
            >
              Get Started
            </Button>
          </div>
        )}
        <DelegationTypeModal
          visible={isOpenModal}
          balance={balance}
          delegateStatus={delegateStatus}
          address={settings.selectedAddress ? settings.selectedAddress : ''}
          onCancel={() => setIsOpenModal(false)}
        />
      </VotingWalletWrapper>
    </Card>
  );
}

VotingWallet.propTypes = {
  balance: PropTypes.string.isRequired,
  earnedBalance: PropTypes.string.isRequired,
  vaiMint: PropTypes.string.isRequired,
  settings: PropTypes.object.isRequired,
  delegateAddress: PropTypes.string.isRequired,
  delegateStatus: PropTypes.string.isRequired
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

export default compose(connectAccount(mapStateToProps, undefined))(
  VotingWallet
);
