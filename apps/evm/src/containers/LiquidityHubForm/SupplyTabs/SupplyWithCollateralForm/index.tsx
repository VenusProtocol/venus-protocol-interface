import { useState } from 'react';
import type { Address } from 'viem';

import { AvailableBalance } from 'components';
import type { TokenApproval } from 'containers/TxFormSubmitButton';
import { useTranslation } from 'libs/translations';
import type {
  Asset,
  AssetBalanceMutation,
  LiquidityHub,
  LiquidityHubBalanceMutation,
  Pool,
} from 'types';
import { calculateCollateralWithdrawLimits, formatTokensToReadableValue } from 'utilities';
import { Form, type FormValues, initialFormValues } from '../../Form';
import { ConvertedSpendingLimit } from './ConvertedSpendingLimit';

export interface SupplyWithCollateralFormProps {
  liquidityHubMigratorContractAddress: Address;
  corePoolAsset: Asset;
  corePool: Pool;
  liquidityHub: LiquidityHub;
  onSubmitSuccess?: () => void;
}

export const SupplyWithCollateralForm: React.FC<SupplyWithCollateralFormProps> = ({
  liquidityHub,
  onSubmitSuccess,
  liquidityHubMigratorContractAddress,
  corePoolAsset,
  corePool,
}) => {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState(initialFormValues);

  const { limitTokens, safeLimitTokens } = calculateCollateralWithdrawLimits({
    asset: corePoolAsset,
    pool: corePool,
  });

  // TODO: wire up
  const handleSubmit = async (_formValues: FormValues) => {};

  // TODO: wire up
  const isSubmitting = false;

  const approval: TokenApproval | undefined = {
    type: 'token',
    token: corePoolAsset.vToken,
    spenderAddress: liquidityHubMigratorContractAddress,
  };

  // TODO: wire up
  const balanceMutations: Array<AssetBalanceMutation | LiquidityHubBalanceMutation> = [];

  const handleLimitClick = limitTokens?.isGreaterThan(0)
    ? () =>
        setFormValues(values => ({
          ...values,
          amountTokens: limitTokens.dp(liquidityHub.vhToken.decimals).toFixed(),
        }))
    : undefined;

  const readableLimit = formatTokensToReadableValue({
    value: limitTokens,
    token: liquidityHub.vhToken.underlyingToken,
  });

  const availableBalanceDom = (
    <div className="space-y-2">
      <AvailableBalance readableBalance={readableLimit} onClick={handleLimitClick} />

      <ConvertedSpendingLimit spenderAddress={approval?.spenderAddress} asset={corePoolAsset} />
    </div>
  );

  return (
    <Form
      isSubmitting={isSubmitting}
      vhToken={liquidityHub.vhToken}
      onSubmit={handleSubmit}
      onSubmitSuccess={onSubmitSuccess}
      balanceMutations={balanceMutations}
      formValues={formValues}
      setFormValues={setFormValues}
      rightMaxButtonLabel={t('liquidityHubForm.rightSafeMaxButtonLabel')}
      submitButtonLabel={t('liquidityHubForm.supplySubmitButtonLabel')}
      approval={approval}
      limitTokens={limitTokens}
      safeLimitTokens={safeLimitTokens}
      availableBalance={availableBalanceDom}
    />
  );
};
