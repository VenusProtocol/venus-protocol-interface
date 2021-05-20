import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import { compose } from 'recompose';
import { Icon } from 'antd';
import Button from '@material-ui/core/Button';
import NumberFormat from 'react-number-format';
import { connectAccount } from 'core';
import { getVaiControllerContract, methods } from 'utilities/ContractService';
import commaNumber from 'comma-number';
import feeImg from 'assets/img/fee.png';
import vaiImg from 'assets/img/coins/vai.svg';
import { TabSection, TabContent } from 'components/Basic/SupplyModal';
import { getBigNumber } from 'utilities/common';

const format = commaNumber.bindWith(',', '.');

function MintTab({ settings }) {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(new BigNumber(0));
  const [mintableVai, setMintableVai] = useState(new BigNumber(0));
  const [feePercent, setFeePercent] = useState(new BigNumber(0));

  const getFeePercent = async () => {
    const appContract = getVaiControllerContract();
    const treasuryPercent = await methods.call(
      appContract.methods.treasuryPercent,
      []
    );
    setFeePercent(new BigNumber(treasuryPercent).times(100).div(1e18));
  };

  useEffect(() => {
    getFeePercent();
  }, []);

  useEffect(() => {
    setMintableVai(getBigNumber(settings.mintableVai));
  }, [settings.mintableVai]);

  /**
   * Max amount
   */
  const handleMaxAmount = () => {
    const totalBorrowBalance = getBigNumber(settings.totalBorrowBalance);
    const totalBorrowLimit = getBigNumber(settings.totalBorrowLimit);
    const safeMax = BigNumber.maximum(
      totalBorrowLimit
        .times(40)
        .div(100)
        .minus(totalBorrowBalance),
      new BigNumber(0)
    );
    setAmount(BigNumber.minimum(mintableVai, safeMax));
  };
  /**
   * Mint
   */
  const handleMintVAI = () => {
    if (settings.selectedAddress) {
      const appContract = getVaiControllerContract();
      setIsLoading(true);
      methods
        .send(
          appContract.methods.mintVAI,
          [
            amount.times(new BigNumber(10).pow(18)).dp(0).toString(10)
          ],
          settings.selectedAddress
        )
        .then(() => {
          setAmount(new BigNumber(0));
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
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
          <span>
            {format(
              getBigNumber(settings.userVaiBalance)
                .dp(2, 1)
                .toString(10)
            )}{' '}
            VAI
          </span>
        </div>
      </TabContent>
    </TabSection>
  );
}

MintTab.propTypes = {
  settings: PropTypes.object
};

MintTab.defaultProps = {
  settings: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

export default compose(connectAccount(mapStateToProps, undefined))(MintTab);
