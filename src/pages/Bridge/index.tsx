import { zodResolver } from '@hookform/resolvers/zod';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { chains, useAccountAddress, useAuthModal, useChainId } from 'packages/wallet';

import { ChainSelect } from './ChainSelect';
import { ReactComponent as LayerZeroLogo } from './layerZeroLogo.svg';

const formSchema = z.object({
  fromChainId: z.number(),
  toChainId: z.number(),
  amountTokens: z.string().min(1),
});

const BRIDGE_DOC_URL = ''; // TODO: add link

const BridgePage: React.FC = () => {
  const { t } = useTranslation();
  const bridgeContract = useGetMaximillionContract(); // TODO: get address from bridge contract
  const { chainId } = useChainId();
  const { openAuthModal } = useAuthModal();
  const { accountAddress } = useAccountAddress();
  const isUserConnected = !!accountAddress;

  // TODO: pass chain ID from form
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const { control, handleSubmit, formState } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromChainId: chainId,
      toChainId: chains.find(chain => chain.id !== chainId)?.id,
      amountTokens: '',
    },
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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // TODO: send transaction
    console.log(values);
  };

  // TODO: wire up
  const readableWalletBalance = '10 XVS';

  const submitButtonLabel = useMemo(() => {
    if (formState.isValid) {
      return t('bridgePage.submitButton.label.submit');
    }

    return t('bridgePage.submitButton.label.enterValidAmount');
  }, [t, formState.isValid]);

  return (
    <div className="mx-auto w-full space-y-6 md:max-w-[544px]">
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6 md:flex md:items-end md:justify-between md:space-x-4">
            <Controller
              name="fromChainId"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <ChainSelect
                  label={t('bridgePage.fromChainSelect.label')}
                  className="mb-4 w-full min-w-0 grow md:mb-0"
                  {...field}
                />
              )}
            />

            <TextButton
              className="mx-auto mb-2 flex h-auto flex-none p-2 md:mb-[3px]"
              // TODO: wire up
              onClick={() => {}}
              disabled={formState.isSubmitting}
            >
              <Icon name="convert" className="h-6 w-6 rotate-90 text-blue md:rotate-0" />
            </TextButton>

            <Controller
              name="toChainId"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <ChainSelect
                  menuPosition="right"
                  className="w-full min-w-0 grow"
                  label={t('bridgePage.toChainSelect.label')}
                  {...field}
                />
              )}
            />
          </div>

          <Controller
            name="amountTokens"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TokenTextField
                token={xvs!}
                label={t('bridgePage.amountInput.label')}
                className="mb-6"
                disabled={formState.isValid || isApproveXvsLoading}
                rightMaxButton={{
                  label: t('bridgePage.amountInput.maxButtonLabel'),
                  onClick: () => {}, // TODO: wire up
                }}
                {...field}
              />
            )}
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
            hideTokenEnablingStep={!isUserConnected || !formState.isValid}
            isTokenApproved={isXvsApproved}
            approveToken={approveXvs}
            isApproveTokenLoading={isApproveXvsLoading}
            isWalletSpendingLimitLoading={isXvsWalletSpendingLimitLoading}
          >
            {isUserConnected ? (
              <PrimaryButton
                type="submit"
                loading={formState.isSubmitting}
                disabled={
                  !formState.isValid ||
                  formState.isSubmitting ||
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
        </form>
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
