import React from 'react';
import styled from 'styled-components';
import { Icon } from 'antd';
import { Card } from 'components/Basic/Card';
import { ProposalInfo } from 'types';
import { generateBscScanUrl } from 'utilities';

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

interface ProposalUserProps {
  proposalInfo: Partial<ProposalInfo>;
}

function ProposalUser({ proposalInfo }: ProposalUserProps) {
  const handleAddLink = (linkType: $TSFixMe, v: $TSFixMe) => {
    window.open(generateBscScanUrl(v, linkType === 'address' ? 'address' : 'tx'), '_blank');
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
              ? `${proposalInfo.proposer.substr(0, 5)}...${proposalInfo.proposer.substr(-4, 4)}`
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

export default ProposalUser;
