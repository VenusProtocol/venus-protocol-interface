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

  const canSupplyDsa = !position.dsaAsset.disabledTokenActions.includes('supply');
  const canWithdrawDsa = !position.dsaAsset.disabledTokenActions.includes('withdraw');
  const canSupplyLong = !position.longAsset.disabledTokenActions.includes('supply');
  const canWithdrawLong = !position.longAsset.disabledTokenActions.includes('withdraw');
  const canBorrowShort =
    !position.shortAsset.disabledTokenActions.includes('borrow') &&
    position.shortAsset.isBorrowableByUser;
  const canRepayShort = !position.shortAsset.disabledTokenActions.includes('repay');

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
    warningMessage = t('yieldPlus.operationForm.warning.cannotSupplyDsa', {
      tokenSymbol: position.dsaAsset.vToken.underlyingToken.symbol,
    });
  }

  if (!canWithdrawDsa && (action === 'reduce' || action === 'close' || action === 'withdrawDsa')) {
    warningMessage = t('yieldPlus.operationForm.warning.cannotWithdrawDsa', {
      tokenSymbol: position.dsaAsset.vToken.underlyingToken.symbol,
    });
  }

  if (!canSupplyLong && (action === 'open' || action === 'increase')) {
    warningMessage = t('yieldPlus.operationForm.warning.cannotSupplyLong', {
      tokenSymbol: position.longAsset.vToken.underlyingToken.symbol,
    });
  }

  if (!canWithdrawLong && (action === 'reduce' || action === 'close')) {
    warningMessage = t('yieldPlus.operationForm.warning.cannotWithdrawLong', {
      tokenSymbol: position.longAsset.vToken.underlyingToken.symbol,
    });
  }

  if (!canBorrowShort && (action === 'open' || action === 'increase')) {
    warningMessage = t('yieldPlus.operationForm.warning.cannotBorrowShort', {
      tokenSymbol: position.shortAsset.vToken.underlyingToken.symbol,
    });
  }

  if (!canRepayShort && (action === 'close' || action === 'reduce')) {
    warningMessage = t('yieldPlus.operationForm.warning.cannotRepayShort', {
      tokenSymbol: position.shortAsset.vToken.underlyingToken.symbol,
    });
  }

  if (!isMaximumLeverageFactorHighEnough && action === 'open') {
    warningMessage = t('yieldPlus.operationForm.warning.notEnoughLeverage', {
      minimumLeverageFactor: MINIMUM_LEVERAGE_FACTOR,
    });
  }

  if (warningMessage) {
    return <NoticeWarning description={warningMessage} />;
  }

  return <Form action={action} position={position} {...otherProps} />;
};
