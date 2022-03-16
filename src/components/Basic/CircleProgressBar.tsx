import React from 'react';
import styled from 'styled-components';
import { Progress } from 'antd';

const CircleProgressBarWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;

  .circle-label {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    margin: 0;
    padding: 0;
    color: var(--color-text-green);
    line-height: 1;
    white-space: normal;
    text-align: center;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);

    .percent {
      color: var(--color-text-green);
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 17px;
    }

    .percent-red {
      color: var(--color-text-red);
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 17px;
    }

    .label {
      color: var(--color-text-secondary);
      font-size: 15.5px;
      font-weight: normal;
    }
  }
`;

interface CircleProgressBarProps {
  label: string;
  percent: number;
  width?: number;
}

function CircleProgressBar({ label, percent, width }: CircleProgressBarProps) {
  return (
    <CircleProgressBarWrapper>
      <Progress
        type="circle"
        strokeColor={{
          '0%': 'var(--color-yellow)',
          '100%': 'var(--color-yellow)',
        }}
        strokeWidth={4}
        strokeLinecap="square"
        trailColor="#30344e"
        percent={100}
        width={width}
        showInfo={false}
      />
      <div className="circle-label">
        <p className={percent < 0 ? 'percent-red' : 'percent'}>{percent}%</p>
        <p className="label">{label}</p>
      </div>
    </CircleProgressBarWrapper>
  );
}

CircleProgressBar.defaultProps = {
  label: 'Default Label',
  percent: 0.0,
  width: 120,
};

export default CircleProgressBar;
