import React from 'react';
import PropTypes from 'prop-types';
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
      background-color: #d99d43;
    }
  }
`;

function LineProgressBar({ label, percent }) {
  return (
    <LineProgressBarWrapper>
      <div className="flex align-center just-between">
        <p className="label">{label}</p>
        <p className="percent">{percent}%</p>
      </div>
      <Progress
        percent={percent}
        strokeColor="#ffffff"
        strokeWidth={7}
        showInfo={false}
      />
    </LineProgressBarWrapper>
  );
}

LineProgressBar.propTypes = {
  label: PropTypes.string,
  percent: PropTypes.number
};

LineProgressBar.defaultProps = {
  label: 'Borrow Limit',
  percent: 0.0
};

export default LineProgressBar;
