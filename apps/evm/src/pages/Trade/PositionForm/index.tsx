import { useGetProportionalCloseTolerancePercentage } from 'clients/api';
import { NoticeWarning } from 'components';
import { useTranslation } from 'libs/translations';
import { calculateMaxLeverageFactor } from '../calculateMaxLeverageFactor';
import { MINIMUM_LEVERAGE_FACTOR } from '../constants';
import { Form, type FormProps } from './Form';

export * from './Form/types';

export const PositionForm: React.FC<FormProps> = ({ action, position, ...otherProps }) => {
  const { t } = useTranslation();

  const { data: getProportionalCloseTolerancePercentageData } =
    useGetProportionalCloseTolerancePercentage();

  const proportionalCloseTolerancePercentage =
    getProportionalCloseTolerancePercentageData?.proportionalCloseTolerancePercentage;

  const canSupplyDsa =
    !position.dsaAsset.disabledTokenActions.includes('supply') && !position.dsaAsset.isRestricted;

  const canWithdrawDsa =
    !position.dsaAsset.disabledTokenActions.includes('withdraw') &&
    (!position.dsaAsset.isRestricted ||
      position.dsaAsset.userSupplyBalanceCents?.isGreaterThan(0) ||
      action === 'close');

  const canSupplyLong =
    !position.longAsset.disabledTokenActions.includes('supply') && !position.longAsset.isRestricted;

  const canWithdrawLong =
    !position.longAsset.disabledTokenActions.includes('withdraw') &&
    (!position.longAsset.isRestricted ||
      position.longAsset.userSupplyBalanceCents?.isGreaterThan(0) ||
      action === 'close');

  const canBorrowShort =
    !position.shortAsset.disabledTokenActions.includes('borrow') &&
    position.shortAsset.isBorrowable &&
    !position.shortAsset.isRestricted;

  const canRepayShort =
    !position.shortAsset.disabledTokenActions.includes('repay') &&
    (!position.shortAsset.isRestricted ||
      position.shortAsset.userBorrowBalanceCents?.isGreaterThan(0) ||
      action === 'close');

  let warningMessage: undefined | string;

  const maximumLeverageFactor =
    typeof proportionalCloseTolerancePercentage === 'number'
      ? calculateMaxLeverageFactor({
          dsaTokenCollateralFactor: position.dsaAsset.collateralFactor,
          longTokenCollateralFactor: position.longAsset.collateralFactor,
          proportionalCloseTolerancePercentage,
        })
      : undefined;

  const isMaximumLeverageFactorHighEnough =
    maximumLeverageFactor === undefined || maximumLeverageFactor >= MINIMUM_LEVERAGE_FACTOR;

  if (!canSupplyDsa && action === 'supplyDsa') {
    warningMessage = t('trade.operationForm.warning.cannotSupplyDsa', {
      tokenSymbol: position.dsaAsset.vToken.underlyingToken.symbol,
    });
  }

  if (!canWithdrawDsa && (action === 'reduce' || action === 'close' || action === 'withdrawDsa')) {
    warningMessage = t('trade.operationForm.warning.cannotWithdrawDsa', {
      tokenSymbol: position.dsaAsset.vToken.underlyingToken.symbol,
    });
  }

  if (!canSupplyLong && (action === 'open' || action === 'increase')) {
    warningMessage = t('trade.operationForm.warning.cannotSupplyLong', {
      tokenSymbol: position.longAsset.vToken.underlyingToken.symbol,
    });
  }

  if (!canWithdrawLong && (action === 'reduce' || action === 'close')) {
    warningMessage = t('trade.operationForm.warning.cannotWithdrawLong', {
      tokenSymbol: position.longAsset.vToken.underlyingToken.symbol,
    });
  }

  if (!canBorrowShort && (action === 'open' || action === 'increase')) {
    warningMessage = t('trade.operationForm.warning.cannotBorrowShort', {
      tokenSymbol: position.shortAsset.vToken.underlyingToken.symbol,
    });
  }

  if (!canRepayShort && (action === 'close' || action === 'reduce')) {
    warningMessage = t('trade.operationForm.warning.cannotRepayShort', {
      tokenSymbol: position.shortAsset.vToken.underlyingToken.symbol,
    });
  }

  if (!isMaximumLeverageFactorHighEnough && action === 'open') {
    warningMessage = t('trade.operationForm.warning.notEnoughLeverage', {
      minimumLeverageFactor: MINIMUM_LEVERAGE_FACTOR,
    });
  }

  if (warningMessage) {
    return <NoticeWarning description={warningMessage} />;
  }

  return <Form action={action} position={position} {...otherProps} />;
};
