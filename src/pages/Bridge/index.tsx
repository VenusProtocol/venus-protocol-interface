import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import {
  ApproveTokenSteps,
  Card,
  Icon,
  LabeledInlineContent,
  PrimaryButton,
  SpendingLimit,
  TextButton,
  TokenTextField,
} from 'components';
import useTokenApproval from 'hooks/useTokenApproval';
import { useGetMaximillionContract } from 'packages/contracts';
import { useGetToken } from 'packages/tokens';
import { useTranslation } from 'packages/translations';
import { chains, useAccountAddress, useAuthModal } from 'packages/wallet';

import { ChainSelect } from './ChainSelect';

const BridgePage: React.FC = () => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const { openAuthModal } = useAuthModal();

  const isUserConnected = !!accountAddress;
  const bridgeContract = useGetMaximillionContract(); // TODO: get address from bridge contract

  const formValues = {
    fromChainId: chains[0].id,
    toChainId: chains[1].id,
  };

  // TODO: pass chain ID from form
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const {
    isTokenApproved: isXvsApproved,
    approveToken: approveXvs,
    isApproveTokenLoading: isApproveXvsLoading,
    isWalletSpendingLimitLoading: isXvsWalletSpendingLimitLoading,
    walletSpendingLimitTokens: xvsWalletSpendingLimitTokens,
    revokeWalletSpendingLimit: revokeXvsWalletSpendingLimit,
    isRevokeWalletSpendingLimitLoading: isRevokeXvsWalletSpendingLimitLoading,
  } = useTokenApproval({
    token: xvs!,
    spenderAddress: bridgeContract?.address,
    accountAddress,
  });

  // TODO: wire up
  const isSubmitting = false;
  const isFormValid = false;
  const readableWalletBalance = '10 XVS';

  const submitButtonLabel = useMemo(() => {
    if (isFormValid) {
      return t('bridgePage.submitButton.label.submit');
    }

    return t('bridgePage.submitButton.label.enterValidAmount');
  }, [t, isFormValid]);

  return (
    <Card className="mx-auto w-full space-y-6 md:max-w-[544px]">
      <div className="md:flex md:items-end md:justify-between md:space-x-4">
        <ChainSelect
          // TODO: wire up
          onChange={() => {}}
          value={formValues.fromChainId}
          label={t('bridgePage.fromChainSelect.label')}
          className="mb-4 w-full min-w-0 grow md:mb-0"
        />

        <TextButton
          className="mx-auto mb-2 flex h-auto flex-none p-2 md:mb-[3px]"
          // TODO: wire up
          onClick={() => {}}
          disabled={isSubmitting}
        >
          <Icon name="convert" className="h-6 w-6 rotate-90 text-blue md:rotate-0" />
        </TextButton>

        <ChainSelect
          // TODO: wire up
          onChange={() => {}}
          value={formValues.toChainId}
          menuPosition="right"
          className="w-full min-w-0 grow"
          label={t('bridgePage.toChainSelect.label')}
        />
      </div>

      <TokenTextField
        name="amountTokens"
        token={xvs!}
        label={t('bridgePage.amountInput.label')}
        value="" // TODO: wire up
        onChange={() => {}} // TODO: wire up
        disabled={isSubmitting || isApproveXvsLoading}
        rightMaxButton={{
          label: t('bridgePage.amountInput.maxButtonLabel'),
          onClick: () => {}, // TODO: wire up
        }}
      />

      <div className="space-y-3">
        <LabeledInlineContent label={t('bridgePage.walletBalance.label')}>
          {readableWalletBalance}
        </LabeledInlineContent>

        <SpendingLimit
          token={xvs!}
          walletBalanceTokens={new BigNumber(100)} // TODO: wire up
          walletSpendingLimitTokens={xvsWalletSpendingLimitTokens}
          onRevoke={revokeXvsWalletSpendingLimit}
          isRevokeLoading={isRevokeXvsWalletSpendingLimitLoading}
        />

        <LabeledInlineContent
          label={t('bridgePage.bridgeGasFee.label')}
          tooltip={t('bridgePage.bridgeGasFee.tooltip')}
        >
          -
        </LabeledInlineContent>
      </div>

      <ApproveTokenSteps
        token={xvs!}
        hideTokenEnablingStep={!isUserConnected || !isFormValid}
        isTokenApproved={isApproveXvsLoading}
        approveToken={approveXvs}
        isApproveTokenLoading={isApproveXvsLoading}
        isWalletSpendingLimitLoading={isXvsWalletSpendingLimitLoading}
      >
        {isUserConnected ? (
          <PrimaryButton
            type="submit"
            loading={isSubmitting}
            disabled={
              !isFormValid ||
              isSubmitting ||
              isApproveXvsLoading ||
              isXvsWalletSpendingLimitLoading ||
              isRevokeXvsWalletSpendingLimitLoading ||
              !isXvsApproved
            }
            className="w-full"
          >
            {submitButtonLabel}
          </PrimaryButton>
        ) : (
          <PrimaryButton className="w-full" onClick={openAuthModal}>
            {t('bridgePage.connectWalletButton.label')}
          </PrimaryButton>
        )}
      </ApproveTokenSteps>
    </Card>
  );
};

export default BridgePage;
