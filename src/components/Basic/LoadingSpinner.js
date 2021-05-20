import React from 'react';
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

function LoadingSpinner({ size }) {
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
