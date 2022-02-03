import React from 'react';
import PropTypes from 'prop-types';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'styl... Remove this comment to see the full error message
import styled from 'styled-components';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reco... Remove this comment to see the full error message
import { compose } from 'recompose';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { withRouter } from 'react-router-dom';
import BigNumber from 'bignumber.js';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'comm... Remove this comment to see the full error message
import commaNumber from 'comma-number';
import { formatApy } from 'utilities/common';
import * as constants from 'utilities/constants';

const MarketInfoWrapper = styled.div`
  .asset-img {
    width: 80px;
    height: 80px;
    margin-bottom: 14px;
  }

  .symbol-name {
    width: 80px;
    font-size: 20px;
    font-weight: 900;
    color: var(--color-text-main);
  }

  @media only screen and (max-width: 768px) {
  }
`;

const MarketInfoContent = styled.div`
  margin-top: 51px;

  .label {
    font-size: 17px;
    font-weight: 900;
    color: var(--color-text-main);
  }
  .value {
    font-size: 16px;
    color: var(--color-text-secondary);
  }

  .row2 {
    margin-top: 58px;
  }
`;

const format = commaNumber.bindWith(',', '.');


function MarketInfo({ marketInfo, marketType }: $TSFixMe) {
  if (!marketInfo.underlyingSymbol) return null;
  return (
    <MarketInfoWrapper>
      <img
        className="asset-img"
        src={
          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          constants.CONTRACT_TOKEN_ADDRESS[
            marketInfo.underlyingSymbol.toLowerCase()
          ]
            ? // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
              constants.CONTRACT_TOKEN_ADDRESS[
                marketInfo.underlyingSymbol.toLowerCase()
              ].asset
            : null
        }
        alt="asset"
      />
      <p className="symbol-name center">{marketInfo.underlyingSymbol}</p>
      <MarketInfoContent>
        <div className="flex align-center just-between row1">
          <div className="net-rate">
            <p className="label">Net Rate</p>
            <p className="value">
              {marketType === 'supply'
                ? formatApy(
                    new BigNumber(
                      +marketInfo.supplyApy < 0.01 ? 0.01 : marketInfo.supplyApy
                    ).plus(
                      new BigNumber(
                        +marketInfo.supplyVenusApy < 0.01
                          ? 0.01
                          : marketInfo.supplyVenusApy
                      )
                    )
                  )
                : formatApy(
                    new BigNumber(
                      Math.abs(+marketInfo.borrowApy) < 0.01
                        ? 0.01
                        : marketInfo.borrowApy
                    ).plus(
                      new BigNumber(
                        marketInfo.borrowVenusApy < 0.01
                          ? 0.01
                          : marketInfo.borrowVenusApy
                      )
                    )
                  )}
            </p>
          </div>
          <div className="supply-apy">
            <p className="label right">
              {marketType === 'supply' ? 'Supply APY' : 'Borrow Apy'}
            </p>
            <p className="value right">
              {marketType === 'supply'
                ? new BigNumber(
                    +marketInfo.supplyApy < 0.01 ? 0.01 : marketInfo.supplyApy
                  )
                    .dp(2, 1)
                    .toString(10)
                : new BigNumber(
                    Math.abs(+marketInfo.borrowApy) < 0.01
                      ? 0.01
                      : marketInfo.borrowApy
                  )
                    .dp(2, 1)
                    .toString(10)}
              %
            </p>
          </div>
        </div>
        <div className="flex align-center just-between row2">
          <div className="distribution-apy">
            <p className="label">Distribution APY</p>
            <p className="value">
              {marketType === 'supply'
                ? formatApy(
                    +marketInfo.supplyVenusApy < 0.01
                      ? 0.01
                      : marketInfo.supplyVenusApy
                  )
                : formatApy(
                    marketInfo.borrowVenusApy < 0.01
                      ? 0.01
                      : marketInfo.borrowVenusApy
                  )}
            </p>
          </div>
          <div className="total-supply">
            <p className="label right">
              {marketType === 'supply' ? 'Total Supply' : 'Total Borrow'}
            </p>
            <p className="value right">
              $
              {format(
                new BigNumber(
                  marketType === 'supply'
                    ? marketInfo.totalSupplyUsd
                    : marketInfo.totalBorrowsUsd
                )
                  .dp(2, 1)
                  .toString(10)
              )}
            </p>
          </div>
        </div>
      </MarketInfoContent>
    </MarketInfoWrapper>
  );
}

MarketInfo.propTypes = {
  marketInfo: PropTypes.object,
  marketType: PropTypes.string
};

MarketInfo.defaultProps = {
  marketInfo: {},
  marketType: 'supply'
};
export default compose(withRouter)(MarketInfo);
