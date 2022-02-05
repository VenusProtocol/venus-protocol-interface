/* eslint-disable no-useless-escape */
import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'styl... Remove this comment to see the full error message
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reco... Remove this comment to see the full error message
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connectAccount, accountActionCreators } from 'core';
import MainLayout from 'containers/Layout/MainLayout';
import CoinInfo from 'components/Vote/CoinInfo';
import VotingWallet from 'components/Vote/VotingWallet';
import VotingPower from 'components/Vote/VotingPower';
import Proposals from 'components/Vote/Proposals';
import { promisify } from 'utilities';
import { Row, Column } from 'components/Basic/Style';
import { useWeb3React } from '@web3-react/core';
import useRefresh from '../../hooks/useRefresh';
import {
  CONTRACT_XVS_TOKEN_ADDRESS,
  CONTRACT_VBEP_ADDRESS
} from '../../utilities/constants';
import {
  useComptroller,
  useToken,
  useVaiUnitroller,
  useXvsVaultProxy
} from '../../hooks/useContract';
import useWeb3 from '../../hooks/useWeb3';
import { getVbepContract } from '../../utilities/contractHelpers';

const VoteWrapper = styled.div`
  height: 100%;
`;


function Vote({ history, getProposals }: $TSFixMe) {
  const [balance, setBalance] = useState(0);
  const [votingWeight, setVotingWeight] = useState('0');
  const [proposals, setProposals] = useState({});
  const [current, setCurrent] = useState(1);
  const [isLoadingProposal, setIsLoadingPropoasl] = useState(false);
  const [earnedBalance, setEarnedBalance] = useState('0.00000000');
  const [vaiMint, setVaiMint] = useState('0.00000000');
  const [delegateAddress, setDelegateAddress] = useState('');
  const [delegateStatus, setDelegateStatus] = useState('');
  const [stakedAmount, setStakedAmount] = useState('');
  const { account } = useWeb3React();
  const { fastRefresh } = useRefresh();
  const xvsTokenContract = useToken('xvs');
  const comptrollerContract = useComptroller();
  const vaiUnitrollerContract = useVaiUnitroller();
  const xvsVaultProxyContract = useXvsVaultProxy();
  const web3 = useWeb3();

  const loadInitialData = useCallback(async () => {
    setIsLoadingPropoasl(true);
    await promisify(getProposals, {
      offset: 0,
      limit: 5
    })
      .then(res => {
        setIsLoadingPropoasl(false);
        // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
        setProposals(res.data);
      })
      .catch(() => {
        setIsLoadingPropoasl(false);
      });
  }, [getProposals]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleChangePage = (
    
    pageNumber: $TSFixMe,
    
    offset: $TSFixMe,
    
    limit: $TSFixMe
  ) => {
    setCurrent(pageNumber);
    setIsLoadingPropoasl(true);
    promisify(getProposals, {
      offset,
      limit
    })
      .then(res => {
        // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
        setProposals(res.data);
        setIsLoadingPropoasl(false);
      })
      .catch(() => {
        setIsLoadingPropoasl(false);
      });
  };

  const updateBalance = async () => {
    if (account) {
      // find the pid of xvs vault, which users get voting powers from
      const length = await xvsVaultProxyContract.methods
        .poolLength(CONTRACT_XVS_TOKEN_ADDRESS)
        .call();

      const [currentVotes, balanceTemp, ...xvsPoolInfos] = await Promise.all([
        // voting power is calculated from user's amount of XVS staked in the XVS vault
        xvsVaultProxyContract.methods.getCurrentVotes(account).call(),
        xvsTokenContract.methods.balanceOf(account).call(),
        // query all xvs pool infos
        ...Array.from({ length }).map((_, index) => {
          return xvsVaultProxyContract.methods
            .poolInfos(CONTRACT_XVS_TOKEN_ADDRESS, index)
            .call();
        })
      ]);

      // find xvs vault pid
      const xvsVaultIndex = xvsPoolInfos.findIndex(
        info =>
          info.token.toLowerCase() === CONTRACT_XVS_TOKEN_ADDRESS.toLowerCase()
      );
      if (xvsVaultIndex < 0) {
        throw new Error('xvs vault not found!');
      }

      setVotingWeight(new BigNumber(currentVotes).div(1e18).toString(10));
      setBalance(
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
        new BigNumber(balanceTemp)
          .div(1e18)
          .dp(4, 1)
          .toString(10)
      );

      const userInfo = await xvsVaultProxyContract.methods
        .getUserInfo(CONTRACT_XVS_TOKEN_ADDRESS, xvsVaultIndex, account)
        .call();
      setStakedAmount(userInfo.amount);
    }
  };

  const getVoteInfo = async () => {
    const myAddress = account;
    if (!myAddress) return;

    let [
      venusInitialIndex,
      venusAccrued,
      venusVAIState,
      vaiMinterIndex,
      vaiMinterAmount
    ] = await Promise.all([
      comptrollerContract.methods.venusInitialIndex().call(),
      comptrollerContract.methods.venusAccrued(myAddress).call(),
      vaiUnitrollerContract.methods.venusVAIState().call(),
      vaiUnitrollerContract.methods.venusVAIMinterIndex(myAddress).call(),
      comptrollerContract.methods.mintedVAIs(myAddress).call()
    ]);
    let venusEarned = new BigNumber(0);
    await Promise.all(
      Object.values(CONTRACT_VBEP_ADDRESS).map(async item => {
        const vBepContract = getVbepContract(web3, item.id);
        let [
          supplyState,
          supplierIndex,
          supplierTokens,
          borrowState,
          borrowerIndex,
          borrowBalanceStored,
          borrowIndex
        ] = await Promise.all([
          comptrollerContract.methods.venusSupplyState(item.address).call(),
          comptrollerContract.methods
            .venusSupplierIndex(item.address, myAddress)
            .call(),
          vBepContract.methods.balanceOf(myAddress).call(),
          comptrollerContract.methods.venusBorrowState(item.address).call(),
          comptrollerContract.methods
            .venusBorrowerIndex(item.address, myAddress)
            .call(),
          vBepContract.methods.borrowBalanceStored(myAddress).call(),
          vBepContract.methods.borrowIndex().call()
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
          const borrowerDelta = borrowerAmount
            .times(deltaIndex)
            .dividedBy(1e36);
          venusEarned = venusEarned.plus(borrowerDelta);
        }
      })
    );

    // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'BigNumber... Remove this comment to see the full error message
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
      // @ts-expect-error ts-migrate(2367) FIXME: This condition will always return 'true' since the... Remove this comment to see the full error message
      venusEarned && venusEarned !== '0' ? `${venusEarned}` : '0.00000000'
    );
    setVaiMint(
      vaiMinterDelta && vaiMinterDelta !== '0'
        ? `${vaiMinterDelta}`
        : '0.00000000'
    );
  };

  const updateDelegate = async () => {
    if (account) {
      const res = await xvsVaultProxyContract.methods.delegates(account).call();
      setDelegateAddress(res);
      if (res !== '0x0000000000000000000000000000000000000000') {
        setDelegateStatus(res === account ? 'self' : 'delegate');
      } else {
        setDelegateStatus('');
      }
    }
  };

  useEffect(() => {
    getVoteInfo();
    updateBalance();
    updateDelegate();
  }, [fastRefresh, account]);

  return (
    <MainLayout title="Vote">
      <VoteWrapper className="flex">
        <Row>
          <Column xs="12" sm="12" md="12">
            <VotingPower
              history={history}
              stakedAmount={stakedAmount}
              // @ts-expect-error ts-migrate(2367) FIXME: This condition will always return 'true' since the... Remove this comment to see the full error message
              balance={balance !== '0' ? `${balance}` : '0.00000000'}
              // @ts-expect-error ts-migrate(2322) FIXME: Type '{ history: any; stakedAmount: string; balanc... Remove this comment to see the full error message
              delegateAddress={delegateAddress}
              delegateStatus={delegateStatus}
              power={
                votingWeight !== '0'
                  ? `${new BigNumber(votingWeight).dp(8, 1).toString(10)}`
                  : '0.00000000'
              }
            />
          </Column>
          <Column xs="12" sm="12" md="5">
            <Row>
              <Column xs="12">
                <CoinInfo
                  // @ts-expect-error ts-migrate(2367) FIXME: This condition will always return 'true' since the... Remove this comment to see the full error message
                  balance={balance !== '0' ? `${balance}` : '0.00000000'}
                  address={account || ''}
                />
              </Column>
              <Column xs="12">
                <VotingWallet
                  // @ts-expect-error ts-migrate(2367) FIXME: This condition will always return 'true' since the... Remove this comment to see the full error message
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
                <Proposals
                  address={account || ''}
                  isLoadingProposal={isLoadingProposal}
                  pageNumber={current}
                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'result' does not exist on type '{}'.
                  proposals={proposals.result}
                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'total' does not exist on type '{}'.
                  total={proposals.total || 0}
                  votingWeight={votingWeight}
                  onChangePage={handleChangePage}
                />
              </Column>
            </Row>
          </Column>
        </Row>
      </VoteWrapper>
    </MainLayout>
  );
}

Vote.propTypes = {
  getProposals: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

Vote.defaultProps = {};


const mapStateToProps = ({ account }: $TSFixMe) => ({
  settings: account.setting
});


const mapDispatchToProps = (dispatch: $TSFixMe) => {
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
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 0-1 arguments, but got 2.
  connectAccount(mapStateToProps, mapDispatchToProps)
)(Vote);
