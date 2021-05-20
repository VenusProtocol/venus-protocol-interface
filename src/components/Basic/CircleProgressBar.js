import React from 'react';
import PropTypes from 'prop-types';
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

function CircleProgressBar({ label, percent, width }) {
  return (
    <CircleProgressBarWrapper>
      <Progress
        type="circle"
        strokeColor={{
          '0%': '#f2c265',
          '100%': '#f7b44f'
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

CircleProgressBar.propTypes = {
  label: PropTypes.string,
  percent: PropTypes.number,
  width: PropTypes.number
};

CircleProgressBar.defaultProps = {
  label: 'Default Label',
  percent: 0.0,
  width: 120
};

export default CircleProgressBar;
