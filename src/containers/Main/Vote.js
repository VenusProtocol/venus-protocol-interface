/* eslint-disable no-useless-escape */
import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connectAccount, accountActionCreators } from 'core';
import {
  getTokenContract,
  getVbepContract,
  getComptrollerContract,
  getVaiControllerContract,
  methods
} from 'utilities/ContractService';
import MainLayout from 'containers/Layout/MainLayout';
import CoinInfo from 'components/Vote/CoinInfo';
import VotingWallet from 'components/Vote/VotingWallet';
import VotingPower from 'components/Vote/VotingPower';
import Proposals from 'components/Vote/Proposals';
import { promisify } from 'utilities';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
import { checkIsValidNetwork } from 'utilities/common';
import { Row, Column } from 'components/Basic/Style';
import * as constants from 'utilities/constants';

const VoteWrapper = styled.div`
  height: 100%;
`;

const SpinnerWrapper = styled.div`
  height: 85vh;
  width: 100%;

  @media only screen and (max-width: 1440px) {
    height: 70vh;
  }
`;

let timeStamp = 0;

function Vote({ settings, getProposals, setSetting }) {
  const [balance, setBalance] = useState(0);
  const [votingWeight, setVotingWeight] = useState('0');
  const [proposals, setProposals] = useState({});
  const [current, setCurrent] = useState(1);
  const [isLoadingProposal, setIsLoadingPropoasl] = useState(false);
  const [earnedBalance, setEarnedBalance] = useState('0.00000000');
  const [vaiMint, setVaiMint] = useState('0.00000000');
  const [delegateAddress, setDelegateAddress] = useState('');
  const [delegateStatus, setDelegateStatus] = useState('');

  const loadInitialData = useCallback(async () => {
    setIsLoadingPropoasl(true);
    await promisify(getProposals, {
      offset: 0,
      limit: 5
    })
      .then(res => {
        setIsLoadingPropoasl(false);
        setProposals(res.data);
      })
      .catch(() => {
        setIsLoadingPropoasl(false);
      });
  }, [getProposals]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleChangePage = (pageNumber, offset, limit) => {
    setCurrent(pageNumber);
    setIsLoadingPropoasl(true);
    promisify(getProposals, {
      offset,
      limit
    })
      .then(res => {
        setProposals(res.data);
        setIsLoadingPropoasl(false);
      })
      .catch(() => {
        setIsLoadingPropoasl(false);
      });
  };

  const updateBalance = async () => {
    if (settings.selectedAddress && checkIsValidNetwork()) {
      const xvsTokenContract = getTokenContract('xvs');
      await methods
        .call(xvsTokenContract.methods.getCurrentVotes, [
          settings.selectedAddress
        ])
        .then(res => {
          const weight = new BigNumber(res)
            .div(new BigNumber(10).pow(18))
            .toString(10);
          setVotingWeight(weight);
        });
      let temp = await methods.call(xvsTokenContract.methods.balanceOf, [
        settings.selectedAddress
      ]);
      temp = new BigNumber(temp)
        .dividedBy(new BigNumber(10).pow(18))
        .dp(4, 1)
        .toString(10);
      setBalance(temp);
    }
  };

  const getVoteInfo = async () => {
    const myAddress = settings.selectedAddress;
    if (!myAddress) return;
    const appContract = getComptrollerContract();
    const vaiContract = getVaiControllerContract();

    let [venusInitialIndex, venusAccrued, venusVAIState, vaiMinterIndex, vaiMinterAmount] = await Promise.all([
      methods.call(appContract.methods.venusInitialIndex, []),
      methods.call(appContract.methods.venusAccrued, [myAddress]),
      methods.call(vaiContract.methods.venusVAIState, []),
      methods.call(vaiContract.methods.venusVAIMinterIndex, [myAddress]),
      methods.call(appContract.methods.mintedVAIs, [myAddress]),
    ]);
    let venusEarned = new BigNumber(0);
    await Promise.all(Object.values(constants.CONTRACT_VBEP_ADDRESS).map(async (item, index) => {
      const vBepContract = getVbepContract(item.id);
      let [supplyState, supplierIndex, supplierTokens, borrowState, borrowerIndex, borrowBalanceStored, borrowIndex] = await Promise.all([
        methods.call(appContract.methods.venusSupplyState, [item.address]),
        methods.call(appContract.methods.venusSupplierIndex, [item.address, myAddress]),
        methods.call(vBepContract.methods.balanceOf, [myAddress]),
        methods.call(appContract.methods.venusBorrowState, [item.address]),
        methods.call(appContract.methods.venusBorrowerIndex, [item.address, myAddress]),
        methods.call(vBepContract.methods.borrowBalanceStored, [myAddress]),
        methods.call(vBepContract.methods.borrowIndex, []),
      ]);
      const supplyIndex = supplyState.index;
      if (+supplierIndex === 0 && +supplyIndex > 0) {
        supplierIndex = venusInitialIndex;
      }
      let deltaIndex = new BigNumber(supplyIndex).minus(supplierIndex);

      const supplierDelta = new BigNumber(supplierTokens)
        .multipliedBy(deltaIndex)
        .dividedBy(1e36);

      venusEarned = venusEarned.plus(supplierDelta);
      if (+borrowerIndex > 0) {
        deltaIndex = new BigNumber(borrowState.index).minus(borrowerIndex);
        const borrowerAmount = new BigNumber(borrowBalanceStored)
          .multipliedBy(1e18)
          .dividedBy(borrowIndex);
        const borrowerDelta = borrowerAmount.times(deltaIndex).dividedBy(1e36);
        venusEarned = venusEarned.plus(borrowerDelta);
      }
    }));

    venusEarned = venusEarned
      .plus(venusAccrued)
      .dividedBy(1e18)
      .dp(8, 1)
      .toString(10);

    const vaiMintIndex = venusVAIState.index;
    if (+vaiMinterIndex === 0 && +vaiMintIndex > 0) {
      vaiMinterIndex = venusInitialIndex;
    }
    const deltaIndex = new BigNumber(vaiMintIndex).minus(
      new BigNumber(vaiMinterIndex)
    );
    const vaiMinterDelta = new BigNumber(vaiMinterAmount)
      .times(deltaIndex)
      .div(1e54)
      .dp(8, 1)
      .toString(10);
    setEarnedBalance(
      venusEarned && venusEarned !== '0' ? `${venusEarned}` : '0.00000000'
    );
    setVaiMint(
      vaiMinterDelta && vaiMinterDelta !== '0'
        ? `${vaiMinterDelta}`
        : '0.00000000'
    );
  };

  const updateDelegate = async () => {
    if (settings.selectedAddress && timeStamp % 3 === 0) {
      const tokenContract = getTokenContract('xvs');
      methods
        .call(tokenContract.methods.delegates, [settings.selectedAddress])
        .then(res => {
          setDelegateAddress(res);
          if (res !== '0x0000000000000000000000000000000000000000') {
            setDelegateStatus(
              res === settings.selectedAddress ? 'self' : 'delegate'
            );
          } else {
            setDelegateStatus('');
          }
        })
        .catch(() => {});
    }
    timeStamp = Date.now();
  };

  useEffect(() => {
    getVoteInfo();
    updateBalance();
    updateDelegate();
  }, [settings.markets]);

  const handleAccountChange = async () => {
    await getVoteInfo();
    await updateBalance();
    setSetting({
      accountLoading: false
    });
  };

  useEffect(() => {
    if (settings.accountLoading) {
      handleAccountChange();
    }
  }, [settings.accountLoading]);

  return (
    <MainLayout title="Vote">
      <VoteWrapper className="flex">
        {(!settings.selectedAddress || settings.accountLoading || settings.wrongNetwork) && (
          <SpinnerWrapper>
            <LoadingSpinner />
          </SpinnerWrapper>
        )}
        {settings.selectedAddress && !settings.accountLoading && !settings.wrongNetwork && (
          <Row>
            <Column xs="12" sm="12" md="5">
              <Row>
                <Column xs="12">
                  <CoinInfo
                    balance={balance !== '0' ? `${balance}` : '0.00000000'}
                    address={
                      settings.selectedAddress ? settings.selectedAddress : ''
                    }
                  />
                </Column>
                <Column xs="12">
                  <VotingWallet
                    balance={balance !== '0' ? `${balance}` : '0.00000000'}
                    earnedBalance={earnedBalance}
                    vaiMint={vaiMint}
                    delegateAddress={delegateAddress}
                    delegateStatus={delegateStatus}
                  />
                </Column>
              </Row>
            </Column>
            <Column xs="12" sm="12" md="7">
              <Row>
                <Column xs="12">
                  <VotingPower
                    power={
                      votingWeight !== '0'
                        ? `${new BigNumber(votingWeight).dp(8, 1).toString(10)}`
                        : '0.00000000'
                    }
                  />
                </Column>
                <Column xs="12">
                  <Proposals
                    address={
                      settings.selectedAddress ? settings.selectedAddress : ''
                    }
                    isLoadingProposal={isLoadingProposal}
                    pageNumber={current}
                    proposals={proposals.result}
                    total={proposals.total || 0}
                    votingWeight={votingWeight}
                    onChangePage={handleChangePage}
                  />
                </Column>
              </Row>
            </Column>
          </Row>
        )}
      </VoteWrapper>
    </MainLayout>
  );
}

Vote.propTypes = {
  settings: PropTypes.object,
  getProposals: PropTypes.func.isRequired,
  setSetting: PropTypes.func.isRequired
};

Vote.defaultProps = {
  settings: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

const mapDispatchToProps = dispatch => {
  const { getProposals, setSetting } = accountActionCreators;

  return bindActionCreators(
    {
      getProposals,
      setSetting
    },
    dispatch
  );
};

export default compose(
  withRouter,
  connectAccount(mapStateToProps, mapDispatchToProps)
)(Vote);
