import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'recompose';
import BigNumber from 'bignumber.js';
import { withRouter } from 'react-router-dom';
import { connectAccount } from 'core';
import {
  getVbepContract,
  getInterestModelContract,
  methods
} from 'utilities/ContractService';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { checkIsValidNetwork } from 'utilities/common';

const InterestRateModelWrapper = styled.div`
  margin: 10px -20px 10px;

  .title {
    font-weight: 900;
    font-size: 17px;
    color: var(--color-text-main);
    margin-bottom: 10px;
  }

  .description {
    font-weight: 900;
    color: var(--color-text-secondary);
    margin-bottom: 50px;
  }

  .percent-wrapper {
    position: relative;
    width: 100%;
    .line {
      width: calc(100% - 60px);
      height: 2px;
      margin-left: 30px;
      background-color: var(--color-yellow);
    }

    .current-percent {
      position: absolute;
      font-size: 12px;
      color: var(--color-yellow);
      &::before {
        position: absolute;
        content: ' ';
        width: 2px;
        margin-left: 1px;
        height: 20px;
        top: 5px;
        background-color: var(--color-yellow);
      }
      p {
        margin-top: 30px;
        margin-left: -20px;
        font-weight: bold;
      }
    }

    .ticker-percent {
      position: absolute;
      top: -25px;
      margin-left: -18px;
      color: var(--color-yellow);
      font-size: 14px;
    }

    .ticker-line {
      position: absolute;
      width: 2px;
      height: 100%;
      background-color: var(--color-white);

      &::before {
        position: absolute;
        content: ' ';
        width: 6px;
        height: 6px;
        border-radius: 50%;
        top: -3px;
        left: -3px;
        z-index: 10;
        background-color: var(--color-yellow);
      }
      &::after {
        position: absolute;
        content: ' ';
        width: 10px;
        height: 10px;
        border-radius: 50%;
        top: -5px;
        left: -5px;
        background-color: var(--color-white);
      }
    }
  }

  .recharts-cartesian-grid {
    opacity: 0;
  }
  .recharts-responsive-container {
    .recharts-surface {
      // margin-top: 40px;
    }
  }
  @media only screen and (max-width: 768px) {
  }
`;

let flag = false;

function InterestRateModel({ settings, currentAsset }) {
  const [graphData, setGraphData] = useState([]);
  const [tickerPos, setTickerPos] = useState(null);
  const [percent, setPercent] = useState(null);
  const [currentPercent, setCurrentPercent] = useState(0);
  const [currentPos, setCurrentPos] = useState(30);

  const CustomizedAxisTick = ({ x, y }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16}>
          {/* {moment(payload.value).format('LLLL')} */}
        </text>
      </g>
    );
  };
  CustomizedAxisTick.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  };

  const getGraphData = async asset => {
    flag = true;
    const vbepContract = getVbepContract(asset);
    const interestRateModel = await methods.call(
      vbepContract.methods.interestRateModel,
      []
    );
    const interestModelContract = getInterestModelContract(interestRateModel);
    const multiplierPerBlock = await methods.call(
      interestModelContract.methods.multiplierPerBlock,
      []
    );
    const baseRatePerBlock = await methods.call(
      interestModelContract.methods.baseRatePerBlock,
      []
    );
    const data = [];
    const marketInfo = settings.markets.find(
      item => item.underlyingSymbol.toLowerCase() === asset.toLowerCase()
    );
    const oneMinusReserveFactor = new BigNumber(1).minus(
      new BigNumber(marketInfo.reserveFactor).div(new BigNumber(10).pow(18))
    );
    // Get Current Utilization Rate
    let cash = await methods.call(vbepContract.methods.getCash, []);
    cash = new BigNumber(cash).div(new BigNumber(10).pow(18));
    const borrows = new BigNumber(marketInfo.totalBorrows2);
    const reserves = new BigNumber(marketInfo.totalReserves || 0).div(
      new BigNumber(10).pow(settings.decimals[asset].token)
    );
    const currentUtilizationRate = borrows.div(
      cash.plus(borrows).minus(reserves)
    );

    const tempCurrentPercent = parseInt(
      +currentUtilizationRate.toString(10) * 100,
      10
    );
    setCurrentPercent(tempCurrentPercent || 0);
    const lineElement = document.getElementById('line');
    if (lineElement) {
      setCurrentPos(30 + (lineElement.clientWidth * tempCurrentPercent) / 100);
    }
    for (let i = 0; i <= 1; i += 0.01) {
      const utilizationRate = i;
      // Borrow Rate
      const borrowRate = new BigNumber(utilizationRate)
        .multipliedBy(new BigNumber(multiplierPerBlock))
        .plus(new BigNumber(baseRatePerBlock));

      // Supply Rate
      const rateToPool = borrowRate.multipliedBy(oneMinusReserveFactor);
      const supplyRate = new BigNumber(utilizationRate).multipliedBy(
        rateToPool
      );
      // supply apy, borrow apy
      const blocksPerDay = 20 * 60 * 24;
      const daysPerYear = 365;

      const mantissa = new BigNumber(10).pow(18);
      const supplyBase = supplyRate
        .div(mantissa)
        .times(blocksPerDay)
        .plus(1);
      const borrowBase = borrowRate
        .div(mantissa)
        .times(blocksPerDay)
        .plus(1);
      const supplyApy = supplyBase
        .pow(daysPerYear - 1)
        .minus(1)
        .times(100);
      const borrowApy = borrowBase
        .pow(daysPerYear - 1)
        .minus(1)
        .times(100);

      data.push({
        percent: i,
        supplyApy: supplyApy.dp(2, 1).toString(10),
        borrowApy: borrowApy.dp(2, 1).toString(10)
      });
    }
    setGraphData(data);
  };

  useEffect(() => {
    if (
      currentAsset &&
      settings.markets &&
      settings.markets.length > 0 &&
      settings.decimals &&
      checkIsValidNetwork() &&
      !flag
    ) {
      getGraphData(currentAsset);
    }
  }, [settings.markets, currentAsset]);

  useEffect(() => {
    flag = false;
  }, [currentAsset]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length !== 0) {
      return (
        <div className="custom-tooltip">
          <p className="label" style={{ color: '#de4993', fontWeight: 'bold' }}>
            {`${new BigNumber(payload[0].value).dp(8, 1)}%`}
          </p>
          <p className="label" style={{ color: '#9dd562', fontWeight: 'bold' }}>
            {`${new BigNumber(payload[1].value).dp(8, 1)}%`}
          </p>
        </div>
      );
    }
    return null;
  };
  CustomTooltip.propTypes = {
    active: PropTypes.bool.isRequired,
    payload: PropTypes.array.isRequired
  };

  const handleMouseMove = e => {
    const graphElement = document.getElementById('percent-wrapper');
    const lineElement = document.getElementById('line');
    if (graphElement && lineElement) {
      const x = e.pageX - graphElement.offsetLeft - 30;
      const tempPercent = (x * 100) / lineElement.clientWidth;
      if (tempPercent >= 0 && tempPercent <= 100) {
        setPercent(parseInt(tempPercent, 10));
        setTickerPos(e.pageX - graphElement.offsetLeft);
      } else if (tempPercent < 0) {
        setPercent(0);
      } else if (tempPercent >= 100) {
        setPercent(100);
      }
      setCurrentPos(30 + (lineElement.clientWidth * currentPercent) / 100);
    }
  };

  return (
    <InterestRateModelWrapper>
      <p className="title">Interest Rate Model</p>
      <p className="description">Utilization vs. APY</p>
      <div
        id="percent-wrapper"
        className="percent-wrapper"
        onMouseMove={handleMouseMove}
      >
        <div id="line" className="line" />
        {graphData.length !== 0 && (
          <div className="current-percent" style={{ left: currentPos || 30 }}>
            <p>Current</p>
          </div>
        )}
        <div
          className="ticker-percent"
          style={{ left: tickerPos || currentPos }}
        >
          {percent === null ? currentPercent : percent} %
        </div>
        <div
          id="ticker-line"
          className="ticker-line"
          style={{ left: tickerPos || currentPos || 30 }}
        />
        <ResponsiveContainer height={400}>
          <LineChart
            data={graphData}
            height={400}
            margin={{
              top: 40,
              right: 30,
              left: 30,
              bottom: 0
            }}
          >
            <defs>
              <linearGradient id="barRedColor" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f06517" />
                <stop offset="100%" stopColor="#de4993" />
              </linearGradient>
              <linearGradient id="barGreenColor" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#9dd562" />
                <stop offset="100%" stopColor="#9dd562" />
              </linearGradient>
            </defs>
            <CartesianGrid />
            <XAxis
              dataKey="percent"
              tickLine={false}
              axisLine={false}
              tick={<CustomizedAxisTick />}
            />
            <YAxis hide />
            <Tooltip cursor={false} content={<CustomTooltip />} />
            <Line
              type="monotone"
              dot={false}
              dataKey="borrowApy"
              stroke="url(#barRedColor)"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dot={false}
              dataKey="supplyApy"
              stroke="url(#barGreenColor)"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </InterestRateModelWrapper>
  );
}

InterestRateModel.propTypes = {
  currentAsset: PropTypes.string,
  settings: PropTypes.object
};

InterestRateModel.defaultProps = {
  currentAsset: '',
  settings: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

export default compose(
  withRouter,
  connectAccount(mapStateToProps, undefined)
)(InterestRateModel);
