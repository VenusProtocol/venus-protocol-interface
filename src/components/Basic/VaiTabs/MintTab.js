import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import { compose } from 'recompose';
import { Icon } from 'antd';
import Button from '@material-ui/core/Button';
import NumberFormat from 'react-number-format';
import { useWeb3React } from '@web3-react/core';
import { connectAccount } from 'core';
import commaNumber from 'comma-number';
import feeImg from 'assets/img/fee.png';
import vaiImg from 'assets/img/coins/vai.svg';
import { TabSection, TabContent } from 'components/Basic/SupplyModal';
import { useVaiUser } from '../../../hooks/useVaiUser';
import { useMarketsUser } from '../../../hooks/useMarketsUser';
import { useVaiUnitroller } from '../../../hooks/useContract';

const format = commaNumber.bindWith(',', '.');

function MintTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(new BigNumber(0));
  const [feePercent, setFeePercent] = useState(new BigNumber(0));
  const { account } = useWeb3React();
  const { userVaiBalance, mintableVai } = useVaiUser();
  const { userTotalBorrowBalance, userTotalBorrowLimit } = useMarketsUser();
  const vaiControllerContract = useVaiUnitroller();

  const getFeePercent = async () => {
    const treasuryPercent = await vaiControllerContract.methods
      .treasuryPercent()
      .call();
    setFeePercent(new BigNumber(treasuryPercent).times(100).div(1e18));
  };

  useEffect(() => {
    getFeePercent();
  }, []);

  /**
   * Max amount
   */
  const handleMaxAmount = () => {
    const safeMax = BigNumber.maximum(
      userTotalBorrowLimit
        .times(40)
        .div(100)
        .minus(userTotalBorrowBalance),
      new BigNumber(0)
    );
    setAmount(BigNumber.minimum(mintableVai, safeMax));
  };
  /**
   * Mint
   */
  const handleMintVAI = async () => {
    setIsLoading(true);
    try {
      await vaiControllerContract.methods
        .mintVAI(
          amount
            .times(new BigNumber(10).pow(18))
            .dp(0)
            .toString(10)
        )
        .send({ from: account });
      setAmount(new BigNumber(0));
    } catch (error) {
      console.log('mint vai error :>> ', error);
    }
    setIsLoading(false);
  };

  return (
    <TabSection>
      <div className="flex flex-column align-center just-center body-content mint-vai-content">
        <div className="flex align-center input-wrapper">
          <NumberFormat
            autoFocus
            value={amount.isZero() ? '0' : amount.toString(10)}
            onValueChange={({ value }) => {
              setAmount(new BigNumber(value));
            }}
            isAllowed={({ value }) => {
              return new BigNumber(value || 0).isLessThanOrEqualTo(mintableVai);
            }}
            thousandSeparator
            allowNegative={false}
            placeholder="0"
          />
          <span className="pointer max" onClick={() => handleMaxAmount()}>
            SAFE MAX
          </span>
        </div>
      </div>
      <TabContent className="flex flex-column align-center just-content vai-content-section">
        <div className="flex flex-column just-center align-center apy-content">
          <div className="description">
            <div className="flex align-center">
              <img className="asset-img" src={vaiImg} alt="asset" />
              <div className="vai-balance">
                <span>Available VAI</span>
                <span>Limit</span>
              </div>
            </div>
            <span>{format(mintableVai.dp(2, 1).toString(10))} VAI</span>
          </div>
          <div className="description">
            <div className="flex align-center">
              <img className="asset-img" src={feeImg} alt="asset" />
              <div className="vai-balance">
                <span>Mint Fee</span>
              </div>
            </div>
            <span>
              {!amount.isNaN()
                ? new BigNumber(amount)
                    .times(feePercent / 100)
                    .dp(4)
                    .toString(10)
                : 0}{' '}
              VAI ({feePercent.toString(10)}%)
            </span>
          </div>
        </div>
        <Button
          className="button vai-auto"
          disabled={
            isLoading ||
            !account ||
            amount.isNaN() ||
            amount.isZero() ||
            amount.isGreaterThan(mintableVai)
          }
          onClick={handleMintVAI}
        >
          {isLoading && <Icon type="loading" />} Mint VAI
        </Button>
        <div className="description">
          <span>VAI Balance</span>
          <span>{format(userVaiBalance.dp(2, 1).toString(10))} VAI</span>
        </div>
      </TabContent>
    </TabSection>
  );
}

export default MintTab;
