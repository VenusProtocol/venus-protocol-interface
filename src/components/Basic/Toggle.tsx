import React from 'react';
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

interface ToggleProps {
  checked: boolean;
  onChecked: () => void;
}

function Toggle({ checked, onChecked }: ToggleProps) {
  return (
    <ToggleWrapper onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
      <Switch checked={checked} onChange={onChecked} />
    </ToggleWrapper>
  );
}

Toggle.defaultProps = {
  checked: true,
  onChecked: () => {},
};

export default Toggle;
