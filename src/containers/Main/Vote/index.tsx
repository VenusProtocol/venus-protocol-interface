/* eslint-disable no-useless-escape */
import React, { useEffect, useState, useCallback, useContext } from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { connectAccount } from 'core';
import CoinInfo from 'components/Vote/CoinInfo';
import VotingWallet from 'components/Vote/VotingWallet';
import VotingPower from 'components/Vote/VotingPower';
import Proposals from 'components/Vote/Proposals';
import { promisify, getToken } from 'utilities';
import { Row, Column } from 'components/Basic/Style';
import useRefresh from 'hooks/useRefresh';
import { VBEP_TOKENS } from 'constants/tokens';
import {
  useComptrollerContract,
  useTokenContract,
  useVaiUnitrollerContract,
  useXvsVaultProxyContract,
} from 'clients/contracts/hooks';
import { useWeb3 } from 'clients/web3';
import { getVTokenContract } from 'clients/contracts/getters';
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
  const [vaiMint, setVaiMint] = useState('0.00000000');
  const [delegateAddress, setDelegateAddress] = useState('');
  const [delegateStatus, setDelegateStatus] = useState('');
  const [stakedAmount, setStakedAmount] = useState('');
  const { account } = useContext(AuthContext);
  const { fastRefresh } = useRefresh();
  const xvsTokenContract = useTokenContract('xvs');
  const comptrollerContract = useComptrollerContract();
  const vaiUnitrollerContract = useVaiUnitrollerContract();
  const xvsVaultProxyContract = useXvsVaultProxyContract();
  const web3 = useWeb3();

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
    if (!myAddress) return;

    const [venusInitialIndex, venusAccrued, venusVAIState, vaiMinterAmount] = await Promise.all([
      comptrollerContract.methods.venusInitialIndex().call(),
      comptrollerContract.methods.venusAccrued(myAddress).call(),
      vaiUnitrollerContract.methods.venusVAIState().call(),
      comptrollerContract.methods.mintedVAIs(myAddress).call(),
    ]);

    let vaiMinterIndex = await Promise.resolve(
      vaiUnitrollerContract.methods.venusVAIMinterIndex(myAddress).call(),
    );
    let venusEarned = new BigNumber(0);
    await Promise.all(
      Object.values(VBEP_TOKENS).map(async item => {
        const vBepContract = getVTokenContract(item.id, web3);
        const [
          supplyState,
          supplierTokens,
          borrowState,
          borrowerIndex,
          borrowBalanceStored,
          borrowIndex,
        ] = await Promise.all([
          comptrollerContract.methods.venusSupplyState(item.address).call(),
          vBepContract.methods.balanceOf(myAddress).call(),
          comptrollerContract.methods.venusBorrowState(item.address).call(),
          comptrollerContract.methods.venusBorrowerIndex(item.address, myAddress).call(),
          vBepContract.methods.borrowBalanceStored(myAddress).call(),
          vBepContract.methods.borrowIndex().call(),
        ]);
        let supplierIndex = await Promise.resolve(
          comptrollerContract.methods.venusSupplierIndex(item.address, myAddress).call(),
        );
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
      }),
    );

    // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'BigNumber... Remove this comment to see the full error message
    venusEarned = venusEarned.plus(venusAccrued).dividedBy(1e18).dp(8, 1).toString(10);

    const vaiMintIndex = venusVAIState.index;
    if (+vaiMinterIndex === 0 && +vaiMintIndex > 0) {
      vaiMinterIndex = venusInitialIndex;
    }
    const deltaIndex = new BigNumber(vaiMintIndex).minus(new BigNumber(vaiMinterIndex));
    const vaiMinterDelta = new BigNumber(vaiMinterAmount)
      .times(deltaIndex)
      .div(1e54)
      .dp(8, 1)
      .toString(10);
    setEarnedBalance(
      // @ts-expect-error ts-migrate(2367) FIXME: This condition will always return 'true' since the... Remove this comment to see the full error message
      venusEarned && venusEarned !== '0' ? `${venusEarned}` : '0.00000000',
    );
    setVaiMint(vaiMinterDelta && vaiMinterDelta !== '0' ? `${vaiMinterDelta}` : '0.00000000');
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
