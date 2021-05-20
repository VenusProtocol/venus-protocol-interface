import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon } from 'antd';
import { Card } from 'components/Basic/Card';

const ProposalUserWrapper = styled.div`
  width: 100%;
  height: 67px;
  border-radius: 25px;
  background-color: var(--color-bg-primary);
  padding: 0 52px;

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

function ProposalUser({ proposalInfo }) {
  const handleAddLink = (linkType, v) => {
    window.open(
      `${process.env.REACT_APP_BSC_EXPLORER}/${
        linkType === 'address' ? 'address' : 'tx'
      }/${v}`,
      '_blank'
    );
  };

  return (
    <Card>
      <ProposalUserWrapper className="flex align-center">
        <div
          className="flex align-center just-center pointer"
          onClick={() => handleAddLink('address', proposalInfo.proposer || '')}
        >
          <p className="highlight">
            {proposalInfo.proposer
              ? `${proposalInfo.proposer.substr(
                  0,
                  5
                )}...${proposalInfo.proposer.substr(-4, 4)}`
              : ''}
          </p>
          <div className="flex align-center just-center copy-btn">
            <Icon type="arrow-right" />
          </div>
        </div>
      </ProposalUserWrapper>
    </Card>
  );
}

ProposalUser.propTypes = {
  proposalInfo: PropTypes.object
};
ProposalUser.defaultProps = {
  proposalInfo: {}
};
export default ProposalUser;
