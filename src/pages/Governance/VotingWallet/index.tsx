import BigNumber from 'bignumber.js';
import {
  Button,
  ButtonWrapper,
  Card,
  Delimiter,
  Icon,
  InfoIcon,
  Link,
  NoticeInfo,
  PrimaryButton,
  TokenIcon,
} from 'components';
import { useGetToken } from 'packages/tokens';
import { useTranslation } from 'packages/translations';
import { governanceChain, useAccountAddress, useAuthModal, useSwitchChain } from 'packages/wallet';
import React, { useMemo, useState } from 'react';
import { Token } from 'types';
import { areTokensEqual, cn, convertMantissaToTokens } from 'utilities';

import {
  useGetCurrentVotes,
  useGetVestingVaults,
  useGetVoteDelegateAddress,
  useSetVoteDelegate,
} from 'clients/api';
import { routes } from 'constants/routing';
import { XVS_SNAPSHOT_URL } from 'constants/xvsSnapshotUrl';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

import DelegateModal from './DelegateModal';
import TEST_IDS from './testIds';

interface VotingWalletUiProps {
  votingWeightMantissa: BigNumber;
  openAuthModal: () => void;
  userStakedMantissa: BigNumber;
  isDataLoading: boolean;
  connectedWallet: boolean;
  currentUserAccountAddress: string | undefined;
  delegate: string | undefined;
  setVoteDelegation: (address: string) => Promise<unknown>;
  isVoteDelegationLoading: boolean;
  delegateModelIsOpen: boolean;
  setDelegateModelIsOpen: (open: boolean) => void;
  xvs?: Token;
}

export const VotingWalletUi: React.FC<VotingWalletUiProps> = ({
  xvs,
  votingWeightMantissa,
  userStakedMantissa,
  connectedWallet,
  isDataLoading,
  openAuthModal,
  currentUserAccountAddress,
  delegate,
  setVoteDelegation,
  isVoteDelegationLoading,
  delegateModelIsOpen,
  setDelegateModelIsOpen,
}) => {
  const { switchChain } = useSwitchChain();
  const voteProposalFeatureEnabled = useIsFeatureEnabled({ name: 'voteProposal' });
  const { t, Trans } = useTranslation();

  const readableXvsLocked = useMemo(
    () =>
      convertMantissaToTokens({
        value: userStakedMantissa,
        token: xvs,
        returnInReadableFormat: true,
        addSymbol: false,
      }),
    [userStakedMantissa, xvs],
  );

  const readableVoteWeight = useMemo(
    () =>
      convertMantissaToTokens({
        value: votingWeightMantissa,
        token: xvs,
        returnInReadableFormat: true,
        addSymbol: false,
      }),
    [votingWeightMantissa, xvs],
  );

  const previouslyDelegated = !!delegate;
  const userHasLockedXVS = userStakedMantissa.isGreaterThan(0);
  const showDepositXvs = !isDataLoading && connectedWallet && !userHasLockedXVS;
  const showDelegateButton =
    !isDataLoading && connectedWallet && userHasLockedXVS && voteProposalFeatureEnabled;
  const shouldApplyMarginToTotalLocked =
    !isDataLoading && (voteProposalFeatureEnabled || !connectedWallet || showDepositXvs);

  return (
    <div className="flex flex-1 flex-col lg:ml-4">
      <h4 className="text-lg font-semibold">{t('vote.votingWallet')}</h4>

      {!voteProposalFeatureEnabled && (
        <NoticeInfo
          className="mt-4 w-full md:mt-6"
          data-testid={TEST_IDS.votingDisabledWarning}
          title={t('vote.multichain.votingOnlyEnabledOnBsc')}
          description={
            <Button
              className="h-auto"
              variant="text"
              onClick={() => switchChain({ chainId: governanceChain.id })}
            >
              {t('vote.multichain.switchToBsc')}
            </Button>
          }
        />
      )}

      <Card className="mt-6 flex flex-col p-6 sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-start">
        <div className="border-r-[#21293A] pb-4 sm:border-r sm:pb-0 sm:pr-10 lg:border-r-0 lg:pb-4">
          <p className="text-base font-semibold text-grey sm:text-sm md:text-base">
            {t('vote.votingWeight')}
          </p>

          <h3 className="text-xl sm:text-lg md:text-xl" data-testid={TEST_IDS.votingWeightValue}>
            {readableVoteWeight}
          </h3>
        </div>

        <Delimiter className="w-full sm:hidden lg:block" />

        <div
          className={cn(
            'mt-4 sm:ml-10 sm:mr-auto sm:mt-0 lg:ml-0 lg:mr-0 lg:mt-4',
            shouldApplyMarginToTotalLocked && 'mb-5 sm:mb-0 lg:mb-5',
          )}
        >
          <div className="mb-1 flex items-end sm:mb-0 lg:mb-1">
            <p className="mr-2 text-base font-semibold text-grey sm:text-sm md:text-base">
              {t('vote.totalLocked')}
            </p>

            {previouslyDelegated && (
              <InfoIcon className="self-center" tooltip={t('vote.youDelegatedTo', { delegate })} />
            )}
          </div>

          <div className="flex flex-row items-center">
            {xvs && <TokenIcon className="mr-3 h-[26px] w-[26px]" token={xvs} />}

            <h3 className="text-xl sm:text-lg md:text-xl" data-testid={TEST_IDS.totalLockedValue}>
              {readableXvsLocked}
            </h3>
          </div>
        </div>

        {!connectedWallet && (
          <PrimaryButton className="text-offWhite lg:w-full" onClick={openAuthModal}>
            {t('connectWallet.connectButton')}
          </PrimaryButton>
        )}

        {showDepositXvs && (
          <ButtonWrapper className="text-offWhite hover:no-underline sm:w-auto lg:w-full" asChild>
            <Link to={routes.vaults.path}>{t('vote.depositXvs')}</Link>
          </ButtonWrapper>
        )}

        {showDelegateButton && (
          <PrimaryButton
            className="text-offWhite sm:w-auto lg:w-full"
            onClick={() => setDelegateModelIsOpen(true)}
            data-testid={TEST_IDS.delegateButton}
          >
            {previouslyDelegated ? t('vote.redelegate') : t('vote.delegate')}
          </PrimaryButton>
        )}
      </Card>

      {voteProposalFeatureEnabled && (
        <>
          <Card className="mt-6 flex flex-col p-6 lg:justify-between">
            <p className="mb-4 font-semibold">{t('vote.toVoteYouShould')}</p>

            <span className="mb-3 text-sm">
              <Trans
                i18nKey="vote.depositYourTokens"
                components={{
                  Link: <Link to={routes.vaults.path} data-testid={TEST_IDS.depositYourTokens} />,
                }}
              />
            </span>

            <span className="text-sm">
              <Trans
                i18nKey="vote.delegateYourVoting"
                components={{
                  Anchor: (
                    <span
                      className="text-blue hover:cursor-pointer hover:underline"
                      role="button"
                      aria-pressed="false"
                      tabIndex={0}
                      onClick={() => setDelegateModelIsOpen(true)}
                      data-testid={TEST_IDS.delegateYourVoting}
                    />
                  ),
                }}
              />
            </span>
          </Card>

          <ButtonWrapper
            variant="secondary"
            className="mt-6 w-full text-offWhite hover:no-underline"
            asChild
          >
            <Link href={XVS_SNAPSHOT_URL}>
              <Icon className="mr-2 h-6 w-6" name="lightening" />
              {t('vote.goToXvsSnapshot')}
            </Link>
          </ButtonWrapper>

          <DelegateModal
            onClose={() => setDelegateModelIsOpen(false)}
            isOpen={delegateModelIsOpen}
            currentUserAccountAddress={currentUserAccountAddress}
            previouslyDelegated={previouslyDelegated}
            setVoteDelegation={setVoteDelegation}
            isVoteDelegationLoading={isVoteDelegationLoading}
            openAuthModal={openAuthModal}
          />
        </>
      )}
    </div>
  );
};

const VotingWallet: React.FC = () => {
  const [delegateModelIsOpen, setDelegateModelIsOpen] = useState(false);
  const { accountAddress } = useAccountAddress();
  const { openAuthModal } = useAuthModal();
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const { data: currentVotesData, isLoading: areCurrentVotesLoading } = useGetCurrentVotes(
    { accountAddress: accountAddress || '' },
    { enabled: !!accountAddress },
  );

  const { data: delegateData, isLoading: isGetVoteDelegateAddressLoading } =
    useGetVoteDelegateAddress(
      { accountAddress: accountAddress || '' },
      { enabled: !!accountAddress },
    );

  const { data: vaults, isLoading: isGetVestingVaultsLoading } = useGetVestingVaults({
    accountAddress,
  });

  const xvsVault = xvs && vaults.find(v => areTokensEqual(v.stakedToken, xvs));
  const userStakedMantissa = xvsVault?.userStakedMantissa || new BigNumber(0);

  const { mutateAsync: setVoteDelegation, isLoading: isVoteDelegationLoading } = useSetVoteDelegate(
    {
      onSuccess: () => setDelegateModelIsOpen(false),
    },
  );

  return (
    <VotingWalletUi
      connectedWallet={!!accountAddress}
      openAuthModal={openAuthModal}
      currentUserAccountAddress={accountAddress}
      votingWeightMantissa={currentVotesData?.votesMantissa || new BigNumber(0)}
      isDataLoading={
        areCurrentVotesLoading ||
        isGetVoteDelegateAddressLoading ||
        isGetVestingVaultsLoading ||
        isVoteDelegationLoading
      }
      userStakedMantissa={userStakedMantissa}
      delegate={delegateData?.delegateAddress}
      setVoteDelegation={(delegateAddress: string) => setVoteDelegation({ delegateAddress })}
      isVoteDelegationLoading={isVoteDelegationLoading}
      delegateModelIsOpen={delegateModelIsOpen}
      setDelegateModelIsOpen={setDelegateModelIsOpen}
      xvs={xvs}
    />
  );
};

export default VotingWallet;
