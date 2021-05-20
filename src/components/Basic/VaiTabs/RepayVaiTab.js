import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Icon } from 'antd';
import Button from '@material-ui/core/Button';
import NumberFormat from 'react-number-format';
import { connectAccount } from 'core';
import BigNumber from 'bignumber.js';
import {
  getVaiControllerContract,
  getVaiTokenContract,
  methods
} from 'utilities/ContractService';
import commaNumber from 'comma-number';
import * as constants from 'utilities/constants';
import vaiImg from 'assets/img/coins/vai.svg';
import { TabSection, TabContent } from 'components/Basic/BorrowModal';
import { getBigNumber } from 'utilities/common';

const format = commaNumber.bindWith(',', '.');

function RepayVaiTab({ settings }) {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(new BigNumber(0));
  const [userVaiMinted, setUserVaiMinted] = useState(new BigNumber(0));
  const [vaiBalance, setVaiBalance] = useState(new BigNumber(0));

  useEffect(() => {
    setUserVaiMinted(getBigNumber(settings.userVaiMinted));
  }, [settings.userVaiMinted]);

  useEffect(() => {
    setVaiBalance(getBigNumber(settings.userVaiBalance));
  }, [settings.userVaiBalance]);

  /**
   * Max amount
   */
  const handleMaxAmount = () => {
    setAmount(BigNumber.minimum(userVaiMinted, vaiBalance));
  };

  /**
   * Approve VAI token
   */
  const onVaiApprove = async () => {
    if (settings.selectedAddress) {
      setIsLoading(true);
      const vaiContract = getVaiTokenContract();
      methods
        .send(
          vaiContract.methods.approve,
          [
            constants.CONTRACT_VAI_UNITROLLER_ADDRESS,
            new BigNumber(2)
              .pow(256)
              .minus(1)
              .toString(10)
          ],
          settings.selectedAddress
        )
        .then(() => {
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  };

  /**
   * Repay VAI
   */
  const handleRepayVAI = () => {
    if (settings.selectedAddress) {
      const appContract = getVaiControllerContract();
      setIsLoading(true);
      methods
        .send(
          appContract.methods.repayVAI,
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
      <div className="flex flex-column align-center just-center body-content repay-vai-content">
        {settings.userVaiEnabled ? (
          <div className="flex align-center input-wrapper">
            <NumberFormat
              autoFocus
              value={amount.isZero() ? '0' : amount.toString(10)}
              onValueChange={({ value }) => {
                setAmount(new BigNumber(value));
              }}
              isAllowed={({ value }) => {
                return new BigNumber(value || 0).isLessThanOrEqualTo(
                  BigNumber.minimum(vaiBalance, userVaiMinted)
                );
              }}
              thousandSeparator
              allowNegative={false}
              placeholder="0"
            />
            <span className="pointer max" onClick={() => handleMaxAmount()}>
              MAX
            </span>
          </div>
        ) : (
          <>
            <img src={vaiImg} alt="asset" />
            <p className="center warning-label">
              To repay VAI to the Venus Protocol, you need to approve it first.
            </p>
          </>
        )}
      </div>
      <TabContent className="flex flex-column align-center just-content vai-content-section">
        <div className="flex flex-column just-center align-center apy-content">
          <div className="description">
            <div className="flex align-center">
              <img className="asset-img" src={vaiImg} alt="asset" />
              <div className="vai-balance">
                <span>Repay VAI</span>
                <span>Balance</span>
              </div>
            </div>
            <span>{format(userVaiMinted.dp(2, 1).toString(10))} VAI</span>
          </div>
        </div>
        {(vaiBalance.isZero() || amount.isGreaterThan(vaiBalance)) && (
          <p className="center warning-label">Your balance is not enough.</p>
        )}
        {!settings.userVaiEnabled ? (
          <Button
            className="button"
            disabled={isLoading || vaiBalance.isZero()}
            onClick={() => {
              onVaiApprove();
            }}
          >
            {isLoading && <Icon type="loading" />} Enable
          </Button>
        ) : (
          <Button
            className="button vai-auto"
            disabled={
              isLoading ||
              amount.isNaN() ||
              amount.isZero() ||
              amount.isGreaterThan(userVaiMinted) ||
              amount.isGreaterThan(vaiBalance)
            }
            onClick={handleRepayVAI}
          >
            {isLoading && <Icon type="loading" />} Repay VAI
          </Button>
        )}
        <div className="description">
          <span>VAI Balance</span>
          <span>{format(vaiBalance.dp(2, 1).toString(10))} VAI</span>
        </div>
      </TabContent>
    </TabSection>
  );
}

RepayVaiTab.propTypes = {
  settings: PropTypes.object
};

RepayVaiTab.defaultProps = {
  settings: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

export default compose(connectAccount(mapStateToProps, undefined))(RepayVaiTab);
