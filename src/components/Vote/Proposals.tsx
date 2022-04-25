import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { Pagination, Tooltip } from 'antd';
import Proposal from 'components/Basic/Proposal';
import ProposalModal from 'components/Vote/ProposalModal';
import toast from 'components/Basic/Toast';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
import arrowRightImg from 'assets/img/arrow-right.png';
import { Card } from 'components/Basic/Card';
import { PrimaryButton } from 'components';
import { Proposal as ProposalObject } from 'types';
import { AuthContext } from 'context/AuthContext';
import { useTokenContract, useGovernorBravoDelegateContract } from 'clients/contracts/hooks';

const ProposalsWrapper = styled.div`
  width: 100%;
  border-radius: 25px;
  background-color: var(--color-bg-primary);
  padding: 20px 30px;

  .proposal-head {
    margin-bottom: 20px;
    .header {
      font-size: 17px;
      font-weight: 900;
      color: var(--color-text-main);
    }
  }

  .footer {
    margin-top: 40px;
    .pages {
      font-size: 16px;
      color: var(--color-text-secondary);
    }

    .ant-pagination-prev,
    .ant-pagination-next {
      display: none;
    }

    .ant-pagination-item a {
      color: var(--color-text-main);
    }

    .ant-pagination-item-active {
      background: transparent;
      border-color: transparent;
      a {
        color: var(--color-orange);
      }
    }

    .ant-pagination-item:focus a,
    .ant-pagination-item:hover a {
      color: var(--color-orange);
    }

    .button {
      flex-direction: row-reverse;

      img {
        width: 26px;
        height: 16px;
        border-radius: 50%;
      }

      .button-prev {
        cursor: pointer;
        img {
          margin-right: 25px;
          transform: rotate(180deg);
        }
      }

      .button-next {
        cursor: pointer;
        span {
          margin-right: 25px;
        }
      }

      .button-prev:focus,
      .button-prev:hover,
      .button-next:focus,
      .button-next:hover {
        span {
          color: var(--color-orange);
        }
      }
    }
  }
`;

const NoProposalWrapper = styled.div`
  width: 100%;
  height: 80px;

  .title {
    font-size: 16px;
    font-weight: 900;
    color: var(--color-text-main);
  }
`;

interface Props {
  address: string;
  isLoadingProposal: boolean;
  votingWeight: string;
  proposals: Array<ProposalObject>;
  pageNumber: number;
  total: number;
  onChangePage: (page: number, total: number, size: number) => void;
}

function Proposals({
  address,
  isLoadingProposal,
  votingWeight,
  pageNumber,
  proposals,
  total,
  onChangePage,
}: Props) {
  const [current, setCurrent] = useState(pageNumber);
  const [pageSize, setPageSize] = useState(5);

  const [proposalModal, setProposalModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [proposalThreshold, setProposalThreshold] = useState(0);
  const [maxOperation, setMaxOperation] = useState(0);
  const [delegateAddress, setDelegateAddress] = useState('');

  const [notProposable, setNotProposable] = useState(false);

  const { account } = useContext(AuthContext);
  const tokenContract = useTokenContract('xvs');
  const governorBravoContract = useGovernorBravoDelegateContract();

  const getVoteProposalInfo = async () => {
    const [threshold, maxOpeartion] = await Promise.all([
      governorBravoContract.methods.proposalThreshold().call(),
      governorBravoContract.methods.proposalMaxOperations().call(),
    ]);
    setProposalThreshold(+Web3.utils.fromWei(threshold, 'ether'));
    setMaxOperation(Number(maxOpeartion));
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      setNotProposable(new BigNumber(votingWeight).lt(new BigNumber(proposalThreshold)));
    }
    return () => {
      isMounted = false;
    };
  }, [votingWeight, proposalThreshold]);

  useEffect(() => {
    if (address) {
      getVoteProposalInfo();
    }
  }, [address]);

  const getDelegatedAddress = async () => {
    const res = await tokenContract.methods.delegates(address).call();
    setDelegateAddress(res);
  };

  useEffect(() => {
    if (
      account &&
      (delegateAddress === '' || delegateAddress === '0x0000000000000000000000000000000000000000')
    ) {
      getDelegatedAddress();
    }
  }, [account, address, delegateAddress]);

  const handleChangePage = (page: number, size?: number) => {
    setCurrent(page);
    if (size) {
      setPageSize(size);
      onChangePage(page, (page - 1) * size, size);
    }
  };

  const onNext = () => {
    handleChangePage(current + 1, 5);
  };

  const onPrev = () => {
    handleChangePage(current - 1, 5);
  };

  const handleShowProposalModal = async () => {
    setIsLoading(true);
    const pId = await governorBravoContract.methods.latestProposalIds(address).call();
    if (pId !== '0') {
      const status = await governorBravoContract.methods.state(pId).call();
      if (status === '0' || status === '1') {
        toast.error({
          title: "You can't create proposal. there is proposal in progress!",
        });
      } else {
        setProposalModal(true);
      }
    } else {
      setProposalModal(true);
    }
    setIsLoading(false);
  };

  return (
    <Card>
      <ProposalsWrapper className="flex flex-column">
        <div className="flex align-center just-between proposal-head">
          <p className="header">Governance Proposals</p>
          {address && (
            <Tooltip
              overlayStyle={{
                backgroundColor: 'var(--color-bg-main)',
                borderRadius: '12px',
              }}
              placement="top"
              title="You must have the voting power of at least 300K XVS to propose"
            >
              <PrimaryButton
                className="button"
                onClick={handleShowProposalModal}
                disabled={notProposable}
                loading={isLoading}
              >
                Create Proposal
              </PrimaryButton>
            </Tooltip>
          )}
        </div>
        <div className="body">
          {isLoadingProposal && <LoadingSpinner />}
          {!isLoadingProposal && proposals && proposals.length !== 0 ? (
            proposals.map((item: $TSFixMe) => (
              <Proposal
                proposal={item}
                votingWeight={votingWeight}
                address={address}
                key={item.id}
              />
            ))
          ) : (
            <NoProposalWrapper className="flex just-center align-center">
              <div className="title">No Proposals</div>
            </NoProposalWrapper>
          )}
        </div>
        {proposals && proposals.length !== 0 && (
          <div className="flex align-center just-between footer">
            <Pagination
              size="small"
              defaultCurrent={1}
              defaultPageSize={5}
              current={current}
              pageSize={pageSize}
              total={total}
              onChange={handleChangePage}
            />
            <div className="flex just-between align-center button">
              {current * pageSize < total && (
                <div className="flex align-center button-next" onClick={onNext}>
                  <span>Next</span>
                  <img src={arrowRightImg} alt="arrow" />
                </div>
              )}
              {current > 1 && (
                <div className="flex align-center button-prev" onClick={onPrev}>
                  <img src={arrowRightImg} alt="arrow" />
                  <span>Prev</span>
                </div>
              )}
            </div>
          </div>
        )}
        <ProposalModal
          address={address}
          visible={proposalModal}
          maxOperation={maxOperation}
          onCancel={() => setProposalModal(false)}
        />
      </ProposalsWrapper>
    </Card>
  );
}

Proposals.defaultProps = {
  proposals: [],
  pageNumber: 1,
  total: 0,
};

export default Proposals;
