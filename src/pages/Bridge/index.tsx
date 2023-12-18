import { zodResolver } from '@hookform/resolvers/zod';
import BigNumber from 'bignumber.js';
import { useCallback, useMemo } from 'react';
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
import useFormatTokensToReadableValue from 'hooks/useFormatTokensToReadableValue';
import useTokenApproval from 'hooks/useTokenApproval';
import { useGetToken } from 'packages/tokens';
import { useTranslation } from 'packages/translations';
import {
  chains,
  useAccountAddress,
  useAuthModal,
  useChainId,
  useSwitchChain,
} from 'packages/wallet';
import { ChainId } from 'types';

import { ChainSelect } from './ChainSelect';
import { ReactComponent as LayerZeroLogo } from './layerZeroLogo.svg';
import TEST_IDS from './testIds';

const formSchema = z.object({
  fromChainId: z.number(),
  toChainId: z.number(),
  amountTokens: z.string().min(1),
});

const BRIDGE_DOC_URL = ''; // TODO: add link (see VEN-2248)

const BridgePage: React.FC = () => {
  const { t } = useTranslation();
  const bridgeContractAddress = ''; // TODO: get address from bridge contract (see VEN-2248)
  const { chainId } = useChainId();
  const { switchChain } = useSwitchChain();
  const { openAuthModal } = useAuthModal();
  const { accountAddress } = useAccountAddress();
  const isUserConnected = !!accountAddress;

  const { control, handleSubmit, formState, watch, getValues, setValue } = useForm<
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromChainId: chainId,
      toChainId: chains.find(chain => chain.id !== chainId)?.id,
      amountTokens: '',
    },
  });

  const fromChainIdValue = watch('fromChainId');

  const xvs = useGetToken({
    symbol: 'XVS',
    chainId: fromChainIdValue,
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
    spenderAddress: bridgeContractAddress,
    accountAddress,
  });

  const handleChainFieldChange = useCallback(
    ({ fromChainId, toChainId }: { fromChainId?: ChainId; toChainId?: ChainId }) => {
      const formValues = getValues();

      if (fromChainId && toChainId) {
        switchChain({
          chainId: fromChainId,
          callback: () => {
            setValue('fromChainId', fromChainId);
            setValue('toChainId', toChainId);
          },
        });
        return;
      }

      if (fromChainId) {
        switchChain({
          chainId: fromChainId,
          callback: () => {
            setValue('fromChainId', fromChainId);

            if (formValues.toChainId === fromChainId) {
              setValue('toChainId', formValues.fromChainId);
            }
          },
        });
        return;
      }

      if (toChainId && formValues.fromChainId === toChainId) {
        switchChain({
          chainId: formValues.toChainId,
          callback: () => {
            setValue('fromChainId', formValues.toChainId);
            setValue('toChainId', toChainId);
          },
        });
        return;
      }

      if (toChainId) {
        setValue('toChainId', toChainId);
      }
    },
    [setValue, switchChain, getValues],
  );

  const switchChains = useCallback(() => {
    const formValues = getValues();

    handleChainFieldChange({
      fromChainId: formValues.toChainId,
      toChainId: formValues.fromChainId,
    });
  }, [getValues, handleChainFieldChange]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // TODO: send transaction (see VEN-2248)
    console.log(values);
  };

  // TODO: wire up
  const walletBalanceTokens = new BigNumber(10);
  const limitTokens = walletBalanceTokens;

  const readableWalletBalance = useFormatTokensToReadableValue({
    value: walletBalanceTokens,
    token: xvs!,
  });

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
                  testId={TEST_IDS.fromChainIdSelect}
                  {...field}
                  onChange={newChainId =>
                    handleChainFieldChange({
                      fromChainId: newChainId as ChainId,
                    })
                  }
                />
              )}
            />

            <TextButton
              className="mx-auto mb-2 flex h-auto flex-none p-2 md:mb-[3px]"
              onClick={switchChains}
              disabled={formState.isSubmitting}
              data-testid={TEST_IDS.switchChainsButton}
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
                  testId={TEST_IDS.toChainIdSelect}
                  {...field}
                  onChange={newChainId =>
                    handleChainFieldChange({
                      toChainId: newChainId as ChainId,
                    })
                  }
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
                data-testid={TEST_IDS.tokenTextField}
                token={xvs!}
                label={t('bridgePage.amountInput.label')}
                className="mb-6"
                disabled={formState.isValid || isApproveXvsLoading}
                rightMaxButton={{
                  label: t('bridgePage.amountInput.maxButtonLabel'),
                  onClick: () => setValue('amountTokens', limitTokens.toFixed()),
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
              walletBalanceTokens={walletBalanceTokens}
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
