import type { Address } from 'viem';

import { ApprovalSteps } from 'components';
import useTokenApproval from 'hooks/useTokenApproval';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { Token } from 'types';

export interface ApproveTokenProps {
  token: Token;
  spenderAddress: Address;
  secondStepButtonLabel: string;
  children: React.ReactNode;
}

export const ApproveToken: React.FC<ApproveTokenProps> = ({
  token,
  spenderAddress,
  secondStepButtonLabel,
  children,
}) => {
  const { accountAddress } = useAccountAddress();
  const { t } = useTranslation();

  const { isTokenApproved, approveToken, isApproveTokenLoading, isWalletSpendingLimitLoading } =
    useTokenApproval({
      token,
      spenderAddress,
      accountAddress,
    });

  const showApproveTokenStep =
    !isWalletSpendingLimitLoading && isTokenApproved !== undefined && !isTokenApproved;

  return (
    <ApprovalSteps
      showApprovalSteps={showApproveTokenStep}
      isApprovalActionLoading={isApproveTokenLoading}
      approvalAction={approveToken}
      firstStepLabel={t('approveTokenSteps.step1')}
      firstStepTooltip={t('approveTokenSteps.approveTokenButton.tooltip')}
      firstStepButtonLabel={t('approveTokenSteps.approveTokenButton.text', {
        tokenSymbol: token.symbol,
      })}
      secondStepLabel={t('approveTokenSteps.step2')}
      secondStepButtonLabel={secondStepButtonLabel}
    >
      {children}
    </ApprovalSteps>
  );
};
