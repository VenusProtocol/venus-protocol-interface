import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'recompose';
import { connectAccount } from 'core';
import commaNumber from 'comma-number';
import { Card } from 'components/Basic/Card';

const TotalInfoWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 25px;
  background-color: var(--color-bg-primary);
  display: flex;
  justify-content: space-between;
  padding: 20px;
  flex-wrap: wrap;

  @media (max-width: 992px) {
    flex-direction: column;
  }

  .total-item {
    padding: 10px;
    width: 50%;
    @media (max-width: 992px) {
      width: 100%;
    }

    .prop {
      font-weight: 600;
      font-size: 18px;
      color: var(--color-text-secondary);
    }

    .value {
      font-weight: 600;
      font-size: 20px;
      color: var(--color-white);
      margin-top: 10px;
    }
  }
`;

const format = commaNumber.bindWith(',', '.');

function TotalInfo({ vaultInfo }) {
  return (
    <Card>
      <TotalInfoWrapper>
        <div className="total-item">
          <div className="prop">XVS emission per day</div>
          <div className="value">{format(vaultInfo.dailyEmission.toFormat(2))} XVS</div>
        </div>
        <div className="total-item">
          <div className="prop">Total XVS Staked</div>
          <div className="value">{format(vaultInfo.totalStaked.toFormat(2))} XVS</div>
        </div>
        <div className="total-item">
          <div className="prop">XVS Staking APY</div>
          <div className="value">{format(vaultInfo.apy.toFormat(2))}%</div>
        </div>
        <div className="total-item">
          <div className="prop">XVS Vault Reward Pool</div>
          <div className="value">{format(vaultInfo.totalPendingRewards.toFormat(2))} XVS</div>
        </div>
      </TotalInfoWrapper>
    </Card>
  );
}

TotalInfo.propTypes = {
  settings: PropTypes.object,
  emission: PropTypes.string.isRequired,
  pendingRewards: PropTypes.string.isRequired
};

TotalInfo.defaultProps = {
  settings: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

export default compose(connectAccount(mapStateToProps, undefined))(TotalInfo);
