import React from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { Card } from 'components/Basic/Card';
import { Label } from 'components/Basic/Label';
import { uid } from 'react-uid';
import { ProposalInfo } from 'types';

const ProposalDetailWrapper = styled.div`
  width: 100%;
  border-radius: 25px;
  background-color: var(--color-bg-primary);
  padding: 27px 41px;
  color: var(--color-text-main);

  .section {
    padding: 10px 0;
    display: flex;
    flex-direction: column;

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      color: var(--color-text-main);
      word-break: break-word;
    }

    p {
      word-break: break-word;
    }
  }
`;

interface ProposalDetailProps {
  proposalInfo: Partial<ProposalInfo>;
}

function ProposalDetail({ proposalInfo }: ProposalDetailProps) {
  return (
    <Card>
      <ProposalDetailWrapper className="flex flex-column">
        <div className="section">
          <Label size="20" primary>
            Operation
          </Label>
          <Label size="14">
            {/**/}
            {(proposalInfo.actions || []).map((s: $TSFixMe) => (
              <ReactMarkdown className="proposal-detail" source={s.title} key={uid(s)} />
            ))}
          </Label>
        </div>
        <div className="section proposal-detail">
          <Label size="20" primary>
            Description
          </Label>
          <Label size="16">
            <ReactMarkdown source={proposalInfo.description} />
          </Label>
        </div>
      </ProposalDetailWrapper>
    </Card>
  );
}

ProposalDetail.defaultProps = {
  proposalInfo: {},
};
export default ProposalDetail;
