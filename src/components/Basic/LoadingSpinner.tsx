import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'styl... Remove this comment to see the full error message
import styled from 'styled-components';
import { Spin, Icon } from 'antd';
import PropTypes from 'prop-types';

const LoadingSpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;

  .loading-spinner {
    color: var(--color-yellow);
  }
`;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
function LoadingSpinner({ size }: $TSFixMe) {
  const antIcon = <Icon type="loading" style={{ fontSize: size }} spin />;
  return (
    <LoadingSpinnerWrapper className="flex align-center just-center">
      <Spin className="loading-spinner" indicator={antIcon} />
    </LoadingSpinnerWrapper>
  );
}

LoadingSpinner.propTypes = {
  size: PropTypes.number
};

LoadingSpinner.defaultProps = {
  size: 64
};

export default LoadingSpinner;
