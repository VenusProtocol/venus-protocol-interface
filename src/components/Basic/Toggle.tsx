import React from 'react';
import PropTypes from 'prop-types';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'styl... Remove this comment to see the full error message
import styled from 'styled-components';
import { Switch } from 'antd';

const ToggleWrapper = styled.div`
  height: 15px;
  margin-top: -5px;

  .ant-switch {
    background-color: var(--color-bg-main);
    border-color: var(--color-bg-main);
    height: 14px;
    &::after {
      background-color: var(--color-dark-grey);
      margin-top: -4px;
    }
  }

  .ant-switch-checked {
    background-color: var(--color-bg-main);
    border-color: var(--color-bg-main);
    height: 14px;
    &::after {
      background-color: var(--color-primary);
    }
  }
`;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
function Toggle({ checked, onChecked }: $TSFixMe) {
  return (
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
    <ToggleWrapper onClick={(e: $TSFixMe) => e.stopPropagation()}>
      <Switch checked={checked} onChange={onChecked} />
    </ToggleWrapper>
  );
}

Toggle.propTypes = {
  checked: PropTypes.bool,
  onChecked: PropTypes.func
};

Toggle.defaultProps = {
  checked: true,
  onChecked: () => {}
};

export default Toggle;
