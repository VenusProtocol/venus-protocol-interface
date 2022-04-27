import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { Row, Col } from 'antd';

import { getToken, getContractAddress } from 'utilities';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
import useRefresh from 'hooks/useRefresh';
import Convert from 'components/VrtConversion/Convert';
import Withdraw from 'components/VrtConversion/Withdraw';
import TabContainer from 'components/Basic/TabContainer';
import {
  useVrtConverterProxyContract,
  useXvsVestingProxyContract,
  useTokenContract,
} from 'clients/contracts/hooks';
import { AuthContext } from 'context/AuthContext';

const VrtConversionWrapper = styled.div`
  margin: 16px;
  display: flex;
  color: #fff;
  .vrt-conversion-container {
    width: 100%;
  }
  .vrt-conversion-tab-container {
    border-radius: 8px;
  }
  .title {
    font-size: 40px;
    line-height: 47px;
    margin-top: 20px;
    margin-bottom: 40px;
    text-align: center;
  }
`;

const VRT_DECIMAL = new BigNumber(10).pow(getToken('vrt').decimals);
const CONVERSION_RATIO_DECIMAL = new BigNumber(10).pow(18);

export default () => {
  // contract data
  const [withdrawableAmount, setWithdrawableAmount] = useState(new BigNumber(0));
  const [conversionRatio, setConversionRatio] = useState(new BigNumber(0));
  const [conversionEndTime, setConversionEndTime] = useState(new BigNumber(0));
  const [userVrtBalance, setUserVrtBalance] = useState(new BigNumber(0));
  // user's allowance to VRT converter contracr
  const [userEnabled, setUserEnabled] = useState(false);

  // UI
  const [loading, setLoading] = useState(true);

  // account
  const { account } = useContext(AuthContext);
  const { fastRefresh } = useRefresh();

  // contracts
  const vrtConverterContract = useVrtConverterProxyContract();
  const xvsVestingContract = useXvsVestingProxyContract();
  const vrtTokenContract = useTokenContract('vrt');
  const xvsTokenContract = useTokenContract('xvs');

  useEffect(() => {
    let mounted = true;
    const update = async () => {
      if (account) {
        try {
          const { totalWithdrawableAmount: totalWithdrawableAmountTemp } =
            await xvsVestingContract.methods.getWithdrawableAmount(account.address).call();
          setWithdrawableAmount(new BigNumber(totalWithdrawableAmountTemp).div(VRT_DECIMAL));
        } catch (e) {
          console.log('no vestings');
        }
      }
      const [conversionRatioTemp, conversionEndTimeTemp, userVrtBalanceTemp, userVrtAllowanceTemp] =
        await Promise.all([
          vrtConverterContract.methods.conversionRatio().call(),
          vrtConverterContract.methods.conversionEndTime().call(),
          account ? vrtTokenContract.methods.balanceOf(account.address).call() : Promise.resolve(0),
          account
            ? vrtTokenContract.methods
                .allowance(account.address, getContractAddress('vrtConverterProxy'))
                .call()
            : Promise.resolve(0),
          xvsTokenContract.methods.balanceOf(xvsVestingContract.options.address).call(),
        ]);
      if (mounted) {
        setLoading(false);
        setConversionRatio(new BigNumber(conversionRatioTemp).div(CONVERSION_RATIO_DECIMAL));
        setConversionEndTime(new BigNumber(conversionEndTimeTemp)); // in seconds
        setUserVrtBalance(new BigNumber(userVrtBalanceTemp).div(VRT_DECIMAL));
        setUserEnabled(new BigNumber(userVrtAllowanceTemp).gt(0));
      }
    };

    update();

    return () => {
      mounted = false;
    };
  }, [fastRefresh, account]);

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <VrtConversionWrapper>
          <Row className="vrt-conversion-container">
            <Col
              xl={{ span: 8, offset: 8 }}
              lg={{ span: 12, offset: 6 }}
              md={{ span: 12, offset: 6 }}
              sm={{ span: 24 }}
              xs={{ span: 24 }}
            >
              <div className="container">
                <TabContainer
                  className="vrt-conversion-tab-container"
                  titles={['Convert & Vest', 'Withdraw']}
                >
                  <Convert
                    userVrtBalance={userVrtBalance}
                    userEnabled={userEnabled}
                    conversionEndTime={conversionEndTime}
                    conversionRatio={conversionRatio}
                    handleClickConvert={async convertAmount => {
                      try {
                        if (!userEnabled && account) {
                          // approve user's VRT allownace to converter
                          await vrtTokenContract.methods
                            .approve(
                              vrtConverterContract.options.address,
                              new BigNumber(2).pow(256).minus(1).toFixed(),
                            )
                            .send({
                              from: account.address,
                            });
                        } else {
                          await vrtConverterContract.methods
                            .convert(convertAmount.times(VRT_DECIMAL).toFixed())
                            .send({
                              from: account?.address,
                            });
                        }
                      } catch (e) {
                        console.log('>> convert error', e);
                      }
                    }}
                    account={account?.address || ''}
                  />
                  <Withdraw
                    withdrawableAmount={withdrawableAmount}
                    handleClickWithdraw={async () => {
                      try {
                        await xvsVestingContract.methods.withdraw().send({
                          from: account?.address,
                        });
                      } catch (e) {
                        console.log('>> withdraw error', e);
                      }
                    }}
                    account={account?.address || ''}
                  />
                </TabContainer>
              </div>
            </Col>
          </Row>
        </VrtConversionWrapper>
      )}
    </>
  );
};
