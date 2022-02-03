import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { Card } from 'components/Basic/Card';
import { Label } from 'components/Basic/Label';

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
      word-break: break-all;
      color: var(--color-text-main);
    }
    p {
      word-break: break-all;
    }
  }
`;

function ProposalDetail({ proposalInfo }) {
  return (
    <Card>
      <ProposalDetailWrapper className="flex flex-column">
        <div className="section">
          <Label size="20" primary>
            Operation
          </Label>
          <Label size="14">
            {(proposalInfo.actions || []).map((s, idx) => (
              <ReactMarkdown className="proposal-detail" source={s.title} key={idx} />
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

ProposalDetail.propTypes = {
  proposalInfo: PropTypes.object
};
ProposalDetail.defaultProps = {
  proposalInfo: {}
};
export default ProposalDetail;
