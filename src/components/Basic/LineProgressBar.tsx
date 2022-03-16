import React from 'react';
import styled from 'styled-components';
import { Progress } from 'antd';

const LineProgressBarWrapper = styled.div`
  width: 100%;

  .label {
    font-size: 13.5px;
    font-weight: 900;
    color: var(--color-text-main);
  }

  .percent {
    font-size: 18px;
    font-weight: 900;
    color: var(--color-text-main);
  }

  .ant-progress {
    .ant-progress-inner {
      background-color: var(--color-bg-main);
    }
  }
  .ant-progress-success-bg,
  .ant-progress-bg {
    background-color: var(--color-text-green) !important;
  }
`;

interface LineProgressBarProps {
  label?: string;
  percent?: number;
}

function LineProgressBar({ label, percent }: LineProgressBarProps) {
  return (
    <LineProgressBarWrapper>
      <div className="flex align-center just-between">
        <p className="label">{label}</p>
        <p className="percent">{percent}%</p>
      </div>
      <Progress percent={percent} strokeColor="#ffffff" strokeWidth={7} showInfo={false} />
    </LineProgressBarWrapper>
  );
}

LineProgressBar.defaultProps = {
  label: 'Borrow Limit',
  percent: 0.0,
};

export default LineProgressBar;
