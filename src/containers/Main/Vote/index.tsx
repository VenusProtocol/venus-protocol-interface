/* eslint-disable no-useless-escape */
import React, { useEffect, useState, useCallback, useContext } from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { connectAccount } from 'core';
import CoinInfo from 'components/Vote/CoinInfo';
import VotingWallet from 'components/Vote/VotingWallet';
import VotingPower from 'components/Vote/VotingPower';
import Proposals from 'components/Vote/Proposals';
import { promisify, getToken, getContractAddress } from 'utilities';
import { Row, Column } from 'components/Basic/Style';
import useRefresh from 'hooks/useRefresh';
import {
  useTokenContract,
  useXvsVaultProxyContract,
  useVenusLensContract,
} from 'clients/contracts/hooks';
import { State } from 'core/modules/initialState';
import { AuthContext } from 'context/AuthContext';

const xvsTokenAddress = getToken('xvs').address;

const VoteWrapper = styled.div`
  height: 100%;
`;

interface VoteProps {
  getProposals: $TSFixMe;
}

function Vote({ getProposals }: VoteProps) {
  const [balance, setBalance] = useState(0);
  const [votingWeight, setVotingWeight] = useState('0');
  const [proposals, setProposals] = useState({});
  const [current, setCurrent] = useState(1);
  const [isLoadingProposal, setIsLoadingPropoasl] = useState(false);
  const [earnedBalance, setEarnedBalance] = useState('0.00000000');
  const [delegateAddress, setDelegateAddress] = useState('');
  const [delegateStatus, setDelegateStatus] = useState('');
  const [stakedAmount, setStakedAmount] = useState('');
  const { account } = useContext(AuthContext);
  const { fastRefresh } = useRefresh();
  const xvsTokenContract = useTokenContract('xvs');
  const xvsVaultProxyContract = useXvsVaultProxyContract();
  const venusLensContract = useVenusLensContract();

  const loadInitialData = useCallback(async () => {
    setIsLoadingPropoasl(true);
    await promisify(getProposals, {
      offset: 0,
      limit: 5,
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
    pageNumber: number,

    offset: number,

    limit: number,
  ) => {
    setCurrent(pageNumber);
    setIsLoadingPropoasl(true);
    promisify(getProposals, {
      offset,
      limit,
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
      const fetchedLength = await xvsVaultProxyContract.methods.poolLength(xvsTokenAddress).call();
      const length = +fetchedLength;

      const [currentVotes, balanceTemp, ...xvsPoolInfos] = await Promise.all([
        // voting power is calculated from user's amount of XVS staked in the XVS vault
        xvsVaultProxyContract.methods.getCurrentVotes(account.address).call(),
        xvsTokenContract.methods.balanceOf(account.address).call(),
        // query all xvs pool infos
        ...Array.from({ length }).map((_, index) =>
          xvsVaultProxyContract.methods.poolInfos(xvsTokenAddress, index).call(),
        ),
      ]);

      // find xvs vault pid
      const xvsVaultIndex = xvsPoolInfos.findIndex(
        info => info.token.toLowerCase() === xvsTokenAddress.toLowerCase(),
      );
      if (xvsVaultIndex < 0) {
        throw new Error('xvs vault not found!');
      }

      setVotingWeight(new BigNumber(currentVotes).div(1e18).toString(10));
      setBalance(
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
        new BigNumber(balanceTemp).div(1e18).dp(4, 1).toString(10),
      );

      const userInfo = await xvsVaultProxyContract.methods
        .getUserInfo(xvsTokenAddress, xvsVaultIndex, account.address)
        .call();
      setStakedAmount(userInfo.amount);
    }
  };

  const getVoteInfo = async () => {
    const myAddress = account?.address;
    if (!myAddress) {
      return;
    }
    const venusEarned = await venusLensContract.methods
      .pendingVenus(myAddress, getContractAddress('comptroller'))
      .call();
    const venusEarnedString = new BigNumber(venusEarned).dividedBy(1e18).dp(8, 1).toString(10);
    setEarnedBalance(venusEarned && venusEarned !== '0' ? `${venusEarnedString}` : '0.00000000');
  };

  const updateDelegate = async () => {
    if (account) {
      const res = await xvsVaultProxyContract.methods.delegates(account.address).call();
      setDelegateAddress(res);
      if (res !== '0x0000000000000000000000000000000000000000') {
        setDelegateStatus(res === account.address ? 'self' : 'delegate');
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
    <VoteWrapper className="flex">
      <Row>
        <Column xs="12" sm="12" md="12">
          <VotingPower
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
                address={account?.address || ''}
              />
            </Column>
            <Column xs="12">
              <VotingWallet
                // @ts-expect-error ts-migrate(2367) FIXME: This condition will always return 'true' since the... Remove this comment to see the full error message
                balance={balance !== '0' ? `${balance}` : '0.00000000'}
                earnedBalance={earnedBalance}
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
                address={account?.address || ''}
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
  );
}

const mapStateToProps = ({ account }: State) => ({
  settings: account.setting,
});

export default connectAccount(mapStateToProps)(Vote);
