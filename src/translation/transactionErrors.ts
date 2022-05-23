import i18next from 'i18next';

const { t } = i18next;

/** Values copied from https://github.com/VenusProtocol/venus-protocol/blob/develop/contracts/transactionErrors.sol */

export const ComptrollerTransactionErrorsError = {
  NO_ERROR: t('transactionErrors.comptrollertransactionErrors.noError'),
  UNAUTHORIZED: t('transactionErrors.comptrollertransactionErrors.unauthorized'),
  COMPTROLLER_MISMATCH: t('transactionErrors.comptrollertransactionErrors.comptrollerMismatch'),
  INSUFFICIENT_SHORTFALL: t('transactionErrors.comptrollertransactionErrors.insufficientShortfall'),
  INSUFFICIENT_LIQUIDITY: t('transactionErrors.comptrollertransactionErrors.insufficientLiquidity'),
  INVALID_CLOSE_FACTOR: t('transactionErrors.comptrollertransactionErrors.invalidCloseFactor'),
  INVALID_COLLATERAL_FACTOR: t(
    'transactionErrors.comptrollertransactionErrors.invalidCollateralFactor',
  ),
  INVALID_LIQUIDATION_INCENTIVE: t(
    'transactionErrors.comptrollertransactionErrors.invalidLiquidationIncentive',
  ),
  MARKET_NOT_ENTERED: t('transactionErrors.comptrollertransactionErrors.marketNotEntered'),
  MARKET_NOT_LISTED: t('transactionErrors.comptrollertransactionErrors.marketNotListed'),
  MARKET_ALREADY_LISTED: t('transactionErrors.comptrollertransactionErrors.marketAlreadyListed'),
  MATH_ERROR: t('transactionErrors.comptrollertransactionErrors.mathError'),
  NONZERO_BORROW_BALANCE: t('transactionErrors.comptrollertransactionErrors.nonzeroBorrowBalance'),
  PRICE_ERROR: t('transactionErrors.comptrollertransactionErrors.priceError'),
  REJECTION: t('transactionErrors.comptrollertransactionErrors.rejection'),
  SNAPSHOT_ERROR: t('transactionErrors.comptrollertransactionErrors.snapshotError'),
  TOO_MANY_ASSETS: t('transactionErrors.comptrollertransactionErrors.tooManyAssets'),
  TOO_MUCH_REPAY: t('transactionErrors.comptrollertransactionErrors.tooMuchRepay'),
  INSUFFICIENT_BALANCE_FOR_VAI: t(
    'transactionErrors.comptrollertransactionErrors.insufficientBalanceForVai',
  ),
};

export const ComptrollerTransactionErrorsFailureInfo = {
  ACCEPT_ADMIN_PENDING_ADMIN_CHECK: t(
    'transactionErrors.comptrollertransactionErrorsFailureInfo.acceptAdminPendingAdminCheck',
  ),
  ACCEPT_PENDING_IMPLEMENTATION_ADDRESS_CHECK: t(
    'transactionErrors.comptrollertransactionErrorsFailureInfo.acceptPendingImplementationAddressCheck',
  ),
  EXIT_MARKET_BALANCE_OWED: t(
    'transactionErrors.comptrollertransactionErrorsFailureInfo.exitMarketBalanceOwed',
  ),
  EXIT_MARKET_REJECTION: t(
    'transactionErrors.comptrollertransactionErrorsFailureInfo.exitMarketRejection',
  ),
  SET_CLOSE_FACTOR_OWNER_CHECK: t(
    'transactionErrors.comptrollertransactionErrorsFailureInfo.setCloseFactorOwnerCheck',
  ),
  SET_CLOSE_FACTOR_VALIDATION: t(
    'transactionErrors.comptrollertransactionErrorsFailureInfo.setCloseFactorValidation',
  ),
  SET_COLLATERAL_FACTOR_OWNER_CHECK: t(
    'transactionErrors.comptrollertransactionErrorsFailureInfo.setCollateralFactorOwnerCheck',
  ),
  SET_COLLATERAL_FACTOR_NO_EXISTS: t(
    'transactionErrors.comptrollertransactionErrorsFailureInfo.setCollateralFactorNoExists',
  ),
  SET_COLLATERAL_FACTOR_VALIDATION: t(
    'transactionErrors.comptrollertransactionErrorsFailureInfo.setCollateralFactorValidation',
  ),
  SET_COLLATERAL_FACTOR_WITHOUT_PRICE: t(
    'transactionErrors.comptrollertransactionErrorsFailureInfo.setCollateralFactorWithoutPrice',
  ),
  SET_IMPLEMENTATION_OWNER_CHECK: t(
    'transactionErrors.comptrollertransactionErrorsFailureInfo.setImplementationOwnerCheck',
  ),
  SET_LIQUIDATION_INCENTIVE_OWNER_CHECK: t(
    'transactionErrors.comptrollertransactionErrorsFailureInfo.setLiquidationIncentiveOwnerCheck',
  ),
  SET_LIQUIDATION_INCENTIVE_VALIDATION: t(
    'transactionErrors.comptrollertransactionErrorsFailureInfo.setLiquidationIncentiveValidation',
  ),
  SET_MAX_ASSETS_OWNER_CHECK: t(
    'transactionErrors.comptrollertransactionErrorsFailureInfo.setMaxAssetsOwnerCheck',
  ),
  SET_PENDING_ADMIN_OWNER_CHECK: t(
    'transactionErrors.comptrollertransactionErrorsFailureInfo.setPendingAdminOwnerCheck',
  ),
  SET_PENDING_IMPLEMENTATION_OWNER_CHECK: t(
    'transactionErrors.comptrollertransactionErrorsFailureInfo.setPendingImplementationOwnerCheck',
  ),
  SET_PRICE_ORACLE_OWNER_CHECK: t(
    'transactionErrors.comptrollertransactionErrorsFailureInfo.setPriceOracleOwnerCheck',
  ),
  SUPPORT_MARKET_EXISTS: t(
    'transactionErrors.comptrollertransactionErrorsFailureInfo.supportMarketExists',
  ),
  SUPPORT_MARKET_OWNER_CHECK: t(
    'transactionErrors.comptrollertransactionErrorsFailureInfo.supportMarketOwnerCheck',
  ),
  SET_PAUSE_GUARDIAN_OWNER_CHECK: t(
    'transactionErrors.comptrollertransactionErrorsFailureInfo.setPauseGuardianOwnerCheck',
  ),
  SET_VAI_MINT_RATE_CHECK: t(
    'transactionErrors.comptrollertransactionErrorsFailureInfo.setVaiMintRateCheck',
  ),
  SET_VAICONTROLLER_OWNER_CHECK: t(
    'transactionErrors.comptrollertransactionErrorsFailureInfo.setVaiControllerOwnerCheck',
  ),
  SET_MINTED_VAI_REJECTION: t(
    'transactionErrors.comptrollertransactionErrorsFailureInfo.setMintedVaiRejection',
  ),
  SET_TREASURY_OWNER_CHECK: t(
    'transactionErrors.comptrollertransactionErrorsFailureInfo.setTreasuryOwnerCheck',
  ),
};

export const TokenTransactionErrorsError = {
  NO_ERROR: t('transactionErrors.tokentransactionErrorsError.noError'),
  UNAUTHORIZED: t('transactionErrors.tokentransactionErrorsError.unauthorized'),
  BAD_INPUT: t('transactionErrors.tokentransactionErrorsError.badInput'),
  COMPTROLLER_REJECTION: t('transactionErrors.tokentransactionErrorsError.comptrollerRejection'),
  COMPTROLLER_CALCULATION_ERROR: t(
    'transactionErrors.tokentransactionErrorsError.comptrollerCalculationError',
  ),
  INTEREST_RATE_MODEL_ERROR: t(
    'transactionErrors.tokentransactionErrorsError.interestRateModelError',
  ),
  INVALID_ACCOUNT_PAIR: t('transactionErrors.tokentransactionErrorsError.invalidAccountPair'),
  INVALID_CLOSE_AMOUNT_REQUESTED: t(
    'transactionErrors.tokentransactionErrorsError.invalidCloseAmountRequested',
  ),
  INVALID_COLLATERAL_FACTOR: t(
    'transactionErrors.tokentransactionErrorsError.invalidCollateralFactor',
  ),
  MATH_ERROR: t('transactionErrors.tokentransactionErrorsError.mathError'),
  MARKET_NOT_FRESH: t('transactionErrors.tokentransactionErrorsError.marketNotFresh'),
  MARKET_NOT_LISTED: t('transactionErrors.tokentransactionErrorsError.marketNotListed'),
  TOKEN_INSUFFICIENT_ALLOWANCE: t(
    'transactionErrors.tokentransactionErrorsError.tokenInsufficientAllowance',
  ),
  TOKEN_INSUFFICIENT_BALANCE: t(
    'transactionErrors.tokentransactionErrorsError.tokenInsufficientBalance',
  ),
  TOKEN_INSUFFICIENT_CASH: t('transactionErrors.tokentransactionErrorsError.tokenInsufficentCash'),
  TOKEN_TRANSFER_IN_FAILED: t(
    'transactionErrors.tokentransactionErrorsError.tokenTransferInFailed',
  ),
  TOKEN_TRANSFER_OUT_FAILED: t(
    'transactionErrors.tokentransactionErrorsError.tokenTransferOutFailed',
  ),
  TOKEN_PRICE_ERROR: t('transactionErrors.tokentransactionErrorsError.tokenPriceError'),
};

export const TokenTransactionErrorsFailureInfo = {
  ACCEPT_ADMIN_PENDING_ADMIN_CHECK: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.acceptAdminPendingAdminCheck',
  ),
  ACCRUE_INTEREST_ACCUMULATED_INTEREST_CALCULATION_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.accrueInterestAccumulatedInterestCalculationFailed',
  ),
  ACCRUE_INTEREST_BORROW_RATE_CALCULATION_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.accrueInterestBorrowRateCalculationFailed',
  ),
  ACCRUE_INTEREST_NEW_BORROW_INDEX_CALCULATION_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.accrueInterestNewBorrowIndexCalculationFailed',
  ),
  ACCRUE_INTEREST_NEW_TOTAL_BORROWS_CALCULATION_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.accrueInterestNewTotalBorrowsCalculationFailed',
  ),
  ACCRUE_INTEREST_NEW_TOTAL_RESERVES_CALCULATION_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.accrueInterestNewTotalReservesCalculationFailed',
  ),
  ACCRUE_INTEREST_SIMPLE_INTEREST_FACTOR_CALCULATION_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.accrueInterestSimpleInterestFactorCalculationFailed',
  ),
  BORROW_ACCUMULATED_BALANCE_CALCULATION_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.borrowAccumulatedBalanceCalculationFailed',
  ),
  BORROW_ACCRUE_INTEREST_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.borrowAccrueInterestFailed',
  ),
  BORROW_CASH_NOT_AVAILABLE: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.borrowCashNotAvailable',
  ),
  BORROW_FRESHNESS_CHECK: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.borrowFreshnessCheck',
  ),
  BORROW_NEW_TOTAL_BALANCE_CALCULATION_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.borrowNewTotalBalanceCalculationFailed',
  ),
  BORROW_NEW_ACCOUNT_BORROW_BALANCE_CALCULATION_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.borrowNewAccountBorrowBalanceCalculationFailed',
  ),
  BORROW_MARKET_NOT_LISTED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.borrowMarketNotListed',
  ),
  BORROW_COMPTROLLER_REJECTION: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.borrowComptrollerRejection',
  ),
  LIQUIDATE_ACCRUE_BORROW_INTEREST_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.liquidateAccrueBorrowInterestFailed',
  ),
  LIQUIDATE_ACCRUE_COLLATERAL_INTEREST_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.liquidateAccrueCollateralInterestFailed',
  ),
  LIQUIDATE_COLLATERAL_FRESHNESS_CHECK: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.liquidateCollateralFreshnessCheck',
  ),
  LIQUIDATE_COMPTROLLER_REJECTION: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.liquidateComptrollerRejection',
  ),
  LIQUIDATE_COMPTROLLER_CALCULATE_AMOUNT_SEIZE_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.liquidateComptrollerCalculateAmountSeizeFailed',
  ),
  LIQUIDATE_CLOSE_AMOUNT_IS_UINT_MAX: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.liquidateCloseAmountIsUintMax',
  ),
  LIQUIDATE_CLOSE_AMOUNT_IS_ZERO: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.liquidateCloseAmountIsZero',
  ),
  LIQUIDATE_FRESHNESS_CHECK: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.liquidateFreshnessCheck',
  ),
  LIQUIDATE_LIQUIDATOR_IS_BORROWER: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.liquidateSeizeIsBorrower',
  ),
  LIQUIDATE_REPAY_BORROW_FRESH_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.liquidateSeizeBorrowFreshFailed',
  ),
  LIQUIDATE_SEIZE_BALANCE_INCREMENT_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.liquidateSeizeBalanceIncrementFailed',
  ),
  LIQUIDATE_SEIZE_BALANCE_DECREMENT_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.liquidateSeizeBalanceDecrementFailed',
  ),
  LIQUIDATE_SEIZE_COMPTROLLER_REJECTION: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.liquidateSeizeComptrollerRejection',
  ),
  LIQUIDATE_SEIZE_LIQUIDATOR_IS_BORROWER: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.liquidateSeizeLiquidatorIsBorrower',
  ),
  LIQUIDATE_SEIZE_TOO_MUCH: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.liquidateSeizeTooMuch',
  ),
  MINT_ACCRUE_INTEREST_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.mintAccrueInterestFailed',
  ),
  MINT_COMPTROLLER_REJECTION: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.mintComptrollerRejection',
  ),
  MINT_EXCHANGE_CALCULATION_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.mintExchangeRateReadFailed',
  ),
  MINT_EXCHANGE_RATE_READ_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.mintExchangeRateReadFailed',
  ),
  MINT_FRESHNESS_CHECK: t('transactionErrors.tokentransactionErrorsFailureInfo.mintFreshnessCheck'),
  MINT_NEW_ACCOUNT_BALANCE_CALCULATION_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.mintNewAccountBalanceCalculationFailed',
  ),
  MINT_NEW_TOTAL_SUPPLY_CALCULATION_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.mintNewTotalSupplyCalculationFailed',
  ),
  MINT_TRANSFER_IN_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.mintTransferInFailed',
  ),
  MINT_TRANSFER_IN_NOT_POSSIBLE: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.mintTransferNotPossible',
  ),
  REDEEM_ACCRUE_INTEREST_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.redeemAccrueInterestFailed',
  ),
  REDEEM_COMPTROLLER_REJECTION: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.redeemComptrollerRejection',
  ),
  REDEEM_EXCHANGE_TOKENS_CALCULATION_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.redeemExchangeTokensCalculationFailed',
  ),
  REDEEM_EXCHANGE_AMOUNT_CALCULATION_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.redeemExchangeAmountCalculatioFailed',
  ),
  REDEEM_EXCHANGE_RATE_READ_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.redeemExchangeRateReadFailed',
  ),
  REDEEM_FRESHNESS_CHECK: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.redeemFreshnessCheck',
  ),
  REDEEM_NEW_ACCOUNT_BALANCE_CALCULATION_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.redeemNewAccountBalanceCalculationFailed',
  ),
  REDEEM_NEW_TOTAL_SUPPLY_CALCULATION_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.redeemNewTotalSupplyCalculationFailed',
  ),
  REDEEM_TRANSFER_OUT_NOT_POSSIBLE: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.redeemTransferOutNotPossible',
  ),
  REDUCE_RESERVES_ACCRUE_INTEREST_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.reduceReservesAccrueInterestFailed',
  ),
  REDUCE_RESERVES_ADMIN_CHECK: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.reduceReservesAdminCheck',
  ),
  REDUCE_RESERVES_CASH_NOT_AVAILABLE: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.reduceReservesCashNotAvailable',
  ),
  REDUCE_RESERVES_FRESH_CHECK: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.reduceReservesFreshCheck',
  ),
  REDUCE_RESERVES_VALIDATION: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.reduceReservesValidation',
  ),
  REPAY_BEHALF_ACCRUE_INTEREST_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.repayBehalfAccrueInterestFailed',
  ),
  REPAY_BORROW_ACCRUE_INTEREST_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.repayBorrowAccrueInterestFailed',
  ),
  REPAY_BORROW_ACCUMULATED_BALANCE_CALCULATION_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.repayBorrowAccumulatedBalanceCalculationFailed',
  ),
  REPAY_BORROW_COMPTROLLER_REJECTION: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.repayBorrowComptrollerRejection',
  ),
  REPAY_BORROW_FRESHNESS_CHECK: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.repayBorrowFreshnessCheck',
  ),
  REPAY_BORROW_NEW_ACCOUNT_BORROW_BALANCE_CALCULATION_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.repayBorrowNewAccountBorrowBalanceCalculationFailed',
  ),
  REPAY_BORROW_NEW_TOTAL_BALANCE_CALCULATION_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.repayBorrowTransferNotPossible',
  ),
  REPAY_BORROW_TRANSFER_IN_NOT_POSSIBLE: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.repayBorrowTransferInNotPossible',
  ),
  SET_COLLATERAL_FACTOR_OWNER_CHECK: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.setCollateralFactorOwnerCheck',
  ),
  SET_COLLATERAL_FACTOR_VALIDATION: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.setCollateralFactorValidation',
  ),
  SET_COMPTROLLER_OWNER_CHECK: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.setComptrollerOwnerCheck',
  ),
  SET_INTEREST_RATE_MODEL_ACCRUE_INTEREST_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.setInterestRateModelAccrueInterestFailed',
  ),
  SET_INTEREST_RATE_MODEL_FRESH_CHECK: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.setInterestRateModelFreshCheck',
  ),
  SET_INTEREST_RATE_MODEL_OWNER_CHECK: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.setInterestRateModelOwnerCheck',
  ),
  SET_MAX_ASSETS_OWNER_CHECK: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.setMaxAssetsOwnerCheck',
  ),
  SET_ORACLE_MARKET_NOT_LISTED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.setOracleMarketNotListed',
  ),
  SET_PENDING_ADMIN_OWNER_CHECK: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.setPendingAdminOwnerCheck',
  ),
  SET_RESERVE_FACTOR_ACCRUE_INTEREST_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.setReserveFactorAccrueInterestFailed',
  ),
  SET_RESERVE_FACTOR_ADMIN_CHECK: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.setReserveFactorAdminCheck',
  ),
  SET_RESERVE_FACTOR_FRESH_CHECK: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.setReserveFactorFreshCheck',
  ),
  SET_RESERVE_FACTOR_BOUNDS_CHECK: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.setReserveFactorBoundsCheck',
  ),
  TRANSFER_COMPTROLLER_REJECTION: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.transferComptrollerRejection',
  ),
  TRANSFER_NOT_ALLOWED: t('transactionErrors.tokentransactionErrorsFailureInfo.transferNotAllowed'),
  TRANSFER_NOT_ENOUGH: t('transactionErrors.tokentransactionErrorsFailureInfo.transferNotEnough'),
  TRANSFER_TOO_MUCH: t('transactionErrors.tokentransactionErrorsFailureInfo.transferTooMuch'),
  ADD_RESERVES_ACCRUE_INTEREST_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.addReservesAccrueInterestFailed',
  ),
  ADD_RESERVES_FRESH_CHECK: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.addReservesFreshCheck',
  ),
  ADD_RESERVES_TRANSFER_IN_NOT_POSSIBLE: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.addReservesTransferInNotPossible',
  ),
  TOKEN_GET_UNDERLYING_PRICE_ERROR: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.tokenGetUnderlyingPriceError',
  ),
  REPAY_VAI_COMPTROLLER_REJECTION: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.repayVaiComptrollerRejection',
  ),
  REPAY_VAI_FRESHNESS_CHECK: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.repayVaiFreshnessCheck',
  ),
  VAI_MINT_EXCHANGE_CALCULATION_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.vaiMintExchangeCalculationFailed',
  ),
  SFT_MINT_NEW_ACCOUNT_BALANCE_CALCULATION_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.sftMintNewAccountBalanceCalculationFailed',
  ),
  REDEEM_FEE_CALCULATION_FAILED: t(
    'transactionErrors.tokentransactionErrorsFailureInfo.redeemFeeCalculationFailed',
  ),
};

export const VAIControllerTransactionErrorsError = {
  NO_ERROR: t('transactionErrors.vaiControllerReporterError.noError'),
  UNAUTHORIZED: t('transactionErrors.vaiControllerReporterError.unauthorized'),
  REJECTION: t('transactionErrors.vaiControllerReporterError.rejection'),
  SNAPSHOT_ERROR: t('transactionErrors.vaiControllerReporterError.snpashotError'),
  PRICE_ERROR: t('transactionErrors.vaiControllerReporterError.priceError'),
  MATH_ERROR: t('transactionErrors.vaiControllerReporterError.mathError'),
  INSUFFICIENT_BALANCE_FOR_VAI: t(
    'transactionErrors.vaiControllerReporterError.insufficientBalanceForVai',
  ),
};

export const VAIControllerTransactionErrorsFailureInfo = {
  SET_PENDING_ADMIN_OWNER_CHECK: t(
    'transactionErrors.vaiControllerReporterFailureInfo.setPendingAdminOwnerCheck',
  ),
  SET_PENDING_IMPLEMENTATION_OWNER_CHECK: t(
    'transactionErrors.vaiControllerReporterFailureInfo.setPendingImplementationOwnerCheck',
  ),
  SET_COMPTROLLER_OWNER_CHECK: t(
    'transactionErrors.vaiControllerReporterFailureInfo.setComptrollerOwnerCheck',
  ),
  ACCEPT_ADMIN_PENDING_ADMIN_CHECK: t(
    'transactionErrors.vaiControllerReporterFailureInfo.acceptAdminPendingAdminCheck',
  ),
  ACCEPT_PENDING_IMPLEMENTATION_ADDRESS_CHECK: t(
    'transactionErrors.vaiControllerReporterFailureInfo.acceptPendingImplementationAddressCheck',
  ),
  VAI_MINT_REJECTION: t('transactionErrors.vaiControllerReporterFailureInfo.vaiMintRejection'),
  VAI_BURN_REJECTION: t('transactionErrors.vaiControllerReporterFailureInfo.vaiBurnRejection'),
  VAI_LIQUIDATE_ACCRUE_BORROW_INTEREST_FAILED: t(
    'transactionErrors.vaiControllerReporterFailureInfo.vaiLiquidateAccrueBorrowInterestFailed',
  ),
  VAI_LIQUIDATE_ACCRUE_COLLATERAL_INTEREST_FAILED: t(
    'transactionErrors.vaiControllerReporterFailureInfo.vaiLiquidateAccrueCollateralInterestFailed',
  ),
  VAI_LIQUIDATE_COLLATERAL_FRESHNESS_CHECK: t(
    'transactionErrors.vaiControllerReporterFailureInfo.vaiLiquidateCollateralFreshnessCheck',
  ),
  VAI_LIQUIDATE_COMPTROLLER_REJECTION: t(
    'transactionErrors.vaiControllerReporterFailureInfo.vaiLiquidateComptrollerRejection',
  ),
  VAI_LIQUIDATE_COMPTROLLER_CALCULATE_AMOUNT_SEIZE_FAILED: t(
    'transactionErrors.vaiControllerReporterFailureInfo.vaiLiquidateComptrollerCalculateAmountSeizeFailed',
  ),
  VAI_LIQUIDATE_CLOSE_AMOUNT_IS_UINT_MAX: t(
    'transactionErrors.vaiControllerReporterFailureInfo.vaiLiquidateCloseAmountIsUintMax',
  ),
  VAI_LIQUIDATE_CLOSE_AMOUNT_IS_ZERO: t(
    'transactionErrors.vaiControllerReporterFailureInfo.vaiLiquidateCloseAmountIsZero',
  ),
  VAI_LIQUIDATE_FRESHNESS_CHECK: t(
    'transactionErrors.vaiControllerReporterFailureInfo.vaiLiquidateFreshnessCheck',
  ),
  VAI_LIQUIDATE_LIQUIDATOR_IS_BORROWER: t(
    'transactionErrors.vaiControllerReporterFailureInfo.vaiLiquidateLiquidatorIsBorrower',
  ),
  VAI_LIQUIDATE_REPAY_BORROW_FRESH_FAILED: t(
    'transactionErrors.vaiControllerReporterFailureInfo.vaiLiquidateRepayBorrowFreshFailed',
  ),
  VAI_LIQUIDATE_SEIZE_BALANCE_INCREMENT_FAILED: t(
    'transactionErrors.vaiControllerReporterFailureInfo.vaiLiquidateSeizeBalanceIncrementFailed',
  ),
  VAI_LIQUIDATE_SEIZE_BALANCE_DECREMENT_FAILED: t(
    'transactionErrors.vaiControllerReporterFailureInfo.vaiLiquidateSeizeBalanceDecrementFailed',
  ),
  VAI_LIQUIDATE_SEIZE_COMPTROLLER_REJECTION: t(
    'transactionErrors.vaiControllerReporterFailureInfo.vaiLiquidateSeizeComptrollerRejection',
  ),
  VAI_LIQUIDATE_SEIZE_LIQUIDATOR_IS_BORROWER: t(
    'transactionErrors.vaiControllerReporterFailureInfo.vaiLiquidateSeizeLiquidatorIsBorrower',
  ),
  VAI_LIQUIDATE_SEIZE_TOO_MUCH: t(
    'transactionErrors.vaiControllerReporterFailureInfo.vaiLiquidateSeizeTooMuch',
  ),
  MINT_FEE_CALCULATION_FAILED: t(
    'transactionErrors.vaiControllerReporterFailureInfo.mintFeeCalculationFailed',
  ),
  SET_TREASURY_OWNER_CHECK: t(
    'transactionErrors.vaiControllerReporterFailureInfo.setTreasureOwnerCheck',
  ),
};
