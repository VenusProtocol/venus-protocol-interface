import { ApproveTokenSteps as ApproveTokenStepsUi } from 'components';
import useTokenApproval from 'hooks/useTokenApproval';
import { useAccountAddress } from 'libs/wallet';
import type { Token } from 'types';

export interface ApproveTokenStepsProps {
  token: Token;
  spenderAddress: string;
  secondStepButtonLabel: string;
  hideSpendingApprovalStep?: boolean;
  children?: React.ReactNode;
}

export const ApproveTokenSteps: React.FC<ApproveTokenStepsProps> = ({
  token,
  spenderAddress,
  secondStepButtonLabel,
  hideSpendingApprovalStep = false,
  children,
}) => {
  const { accountAddress } = useAccountAddress();

  const { isTokenApproved, approveToken, isApproveTokenLoading, isWalletSpendingLimitLoading } =
    useTokenApproval({
      token,
      spenderAddress,
      accountAddress,
    });

  return (
    <ApproveTokenStepsUi
      token={token}
      isUsingSwap
      hideTokenEnablingStep={hideSpendingApprovalStep}
      isTokenApproved={isTokenApproved}
      approveToken={approveToken}
      isApproveTokenLoading={isApproveTokenLoading}
      isWalletSpendingLimitLoading={isWalletSpendingLimitLoading}
      secondStepButtonLabel={secondStepButtonLabel}
    >
      {children}
    </ApproveTokenStepsUi>
  );
};
