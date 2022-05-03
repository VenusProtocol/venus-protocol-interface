import React from 'react';
import styled from 'styled-components';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import BigNumber from 'bignumber.js';

import { formatToReadablePercentage, format } from 'utilities/common';
import { getToken } from 'utilities';
import { TokenId } from 'types';

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

interface MarketInfoObjectType {
  underlyingSymbol: Uppercase<TokenId>;
  supplyApy: number;
  supplyVenusApy: number;
  borrowApy: number;
  borrowVenusApy: number;
  totalSupplyUsd: number;
  totalBorrowsUsd: number;
}

interface Props extends RouteComponentProps {
  marketInfo: Partial<MarketInfoObjectType>;
  marketType: string;
}

function MarketInfo({ marketInfo, marketType }: Props) {
  // marketInfo gets passed around as an empty object this seems to be checking for that
  if (!marketInfo.underlyingSymbol) return null;
  return (
    <MarketInfoWrapper>
      <img
        className="asset-img"
        src={
          getToken(marketInfo.underlyingSymbol.toLowerCase() as TokenId).asset
            ? getToken(marketInfo.underlyingSymbol.toLowerCase() as TokenId).asset
            : ''
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
                ? formatToReadablePercentage(
                    new BigNumber(
                      // @ts-expect-error marketInfo gets passed around as an empty object
                      +marketInfo.supplyApy < 0.01 ? 0.01 : marketInfo.supplyApy,
                    ).plus(
                      new BigNumber(
                        // @ts-expect-error marketInfo gets passed around as an empty object
                        +marketInfo.supplyVenusApy < 0.01 ? 0.01 : marketInfo.supplyVenusApy,
                      ),
                    ),
                  )
                : formatToReadablePercentage(
                    new BigNumber(
                      // @ts-expect-error marketInfo gets passed around as an empty object
                      Math.abs(+marketInfo.borrowApy) < 0.01 ? 0.01 : marketInfo.borrowApy,
                    ).plus(
                      new BigNumber(
                        // @ts-expect-error marketInfo gets passed around as an empty object
                        marketInfo.borrowVenusApy < 0.01 ? 0.01 : marketInfo.borrowVenusApy,
                      ),
                    ),
                  )}
            </p>
          </div>
          <div className="supply-apy">
            <p className="label right">{marketType === 'supply' ? 'Supply APY' : 'Borrow Apy'}</p>
            <p className="value right">
              {marketType === 'supply'
                ? new BigNumber(
                    // @ts-expect-error marketInfo gets passed around as an empty object
                    +marketInfo.supplyApy < 0.01 ? 0.01 : marketInfo.supplyApy,
                  )
                    .dp(2, 1)
                    .toString(10)
                : new BigNumber(
                    // @ts-expect-error marketInfo gets passed around as an empty object
                    Math.abs(+marketInfo.borrowApy) < 0.01 ? 0.01 : marketInfo.borrowApy,
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
                ? formatToReadablePercentage(
                    // @ts-expect-error marketInfo gets passed around as an empty object
                    +marketInfo.supplyVenusApy < 0.01 ? 0.01 : marketInfo.supplyVenusApy,
                  )
                : formatToReadablePercentage(
                    // @ts-expect-error marketInfo gets passed around as an empty object
                    marketInfo.borrowVenusApy < 0.01 ? 0.01 : marketInfo.borrowVenusApy,
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
                  // @ts-expect-error marketInfo gets passed around as an empty object
                  marketType === 'supply' ? marketInfo.totalSupplyUsd : marketInfo.totalBorrowsUsd,
                ),
              )}
            </p>
          </div>
        </div>
      </MarketInfoContent>
    </MarketInfoWrapper>
  );
}

MarketInfo.defaultProps = {
  marketType: 'supply',
};

export default withRouter(MarketInfo);
