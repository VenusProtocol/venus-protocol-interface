/* eslint-disable no-useless-escape */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Icon } from 'antd';
import { Card } from 'components/Basic/Card';
import toast from 'components/Basic/Toast';

const ProposerInfoWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 25px;
  background-color: var(--color-bg-primary);
  padding: 25px 40px 28px;

  .address {
    font-size: 17.5px;
    font-weight: 900;
    color: var(--color-text-main);
  }

  span {
    font-size: 15px;
    font-weight: 500;
    color: var(--color-text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
  }

  i {
    color: var(--color-text-main);
  }
`;

function ProposerInfo({ address }) {
  const handleLink = () => {
    window.open(
      `${process.env.REACT_APP_BSC_EXPLORER}/address/${address}`,
      '_blank'
    );
  };
  return (
    <Card>
      <ProposerInfoWrapper className="flex flex-column">
        <div className="address">
          {`${address.substr(0, 4)}...${address.substr(address.length - 4, 4)}`}
        </div>
        <div className="flex just-between align-center">
          <span className="highlight pointer" onClick={() => handleLink()}>
            {address}
          </span>
          <CopyToClipboard
            text={address}
            onCopy={() => {
              toast.success({
                title: `Copied address`
              });
            }}
          >
            <Icon className="pointer copy-btn" type="copy" />
          </CopyToClipboard>
        </div>
      </ProposerInfoWrapper>
    </Card>
  );
}

ProposerInfo.propTypes = {
  address: PropTypes.string
};

ProposerInfo.defaultProps = {
  address: ''
};

export default compose(withRouter)(ProposerInfo);
