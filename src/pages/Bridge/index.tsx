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
import { Link } from 'containers/Link';
import useTokenApproval from 'hooks/useTokenApproval';
import { useGetMaximillionContract } from 'packages/contracts';
import { useGetToken } from 'packages/tokens';
import { useTranslation } from 'packages/translations';
import { chains, useAccountAddress, useAuthModal } from 'packages/wallet';

import { ChainSelect } from './ChainSelect';
import { ReactComponent as LayerZeroLogo } from './layerZeroLogo.svg';

const BRIDGE_DOC_URL = ''; // TODO: add link

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
    <div className="mx-auto w-full space-y-6 md:max-w-[544px]">
      <Card>
        <div className="mb-6 md:flex md:items-end md:justify-between md:space-x-4">
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
          className="mb-6"
          disabled={isSubmitting || isApproveXvsLoading}
          rightMaxButton={{
            label: t('bridgePage.amountInput.maxButtonLabel'),
            onClick: () => {}, // TODO: wire up
          }}
        />

        <div className="mb-6 space-y-3">
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
        </div>

        <LabeledInlineContent
          label={t('bridgePage.bridgeGasFee.label')}
          tooltip={t('bridgePage.bridgeGasFee.tooltip')}
          className="mb-10"
        >
          -
        </LabeledInlineContent>

        <ApproveTokenSteps
          className="mt-10"
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

      <div className="flex items-center justify-center space-x-3">
        <div className="flex items-center">
          <span className="mr-1 text-sm text-grey">{t('bridgePage.footer.poweredBy')}</span>
          <LayerZeroLogo className="w-[80px]" />
        </div>

        <div className="h-5 w-[1px] bg-lightGrey" />

        <Link href={BRIDGE_DOC_URL} className="flex items-center text-sm">
          {t('bridgePage.footer.bridgeDocLink')}

          <Icon name="open" className="ml-1 text-inherit" />
        </Link>
      </div>
    </div>
  );
};

export default BridgePage;
