import { t } from 'libs/translations';

export const customErrorPhrases: Record<string, string> = {
  ActionPaused: t('contractErrors.actionPaused'),
  InsufficientLiquidity: t('contractErrors.insufficientLiquidity'),
  InsufficientCollateral: t('contractErrors.insufficientCollateral'),
  SupplyCapExceeded: t('contractErrors.supplyCapExceeded'),
  BorrowCapExceeded: t('contractErrors.borrowCapExceeded'),
  TooMuchRepay: t('contractErrors.tooMuchRepay'),
  SwapDeadlineExpire: t('contractErrors.swapDeadlineExpire'),
};
