import BigNumber from 'bignumber.js';
import { useMemo, useState } from 'react';

import { cn } from '@venusprotocol/ui';
import {
  useGetCurrentVotes,
  useGetVestingVaults,
  useGetVoteDelegateAddress,
  useSetVoteDelegate,
} from 'clients/api';
import {
  Button,
  ButtonWrapper,
  Card,
  Delimiter,
  Icon,
  InfoIcon,
  NoticeInfo,
  PrimaryButton,
  TokenIcon,
} from 'components';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { governanceChainId, useAccountAddress, useAuthModal, useSwitchChain } from 'libs/wallet';
import { areTokensEqual, convertMantissaToTokens } from 'utilities';

import config from 'config';
import { NULL_ADDRESS } from 'constants/address';
import DelegateModal from './DelegateModal';
import TEST_IDS from './testIds';

const XVS_SNAPSHOT_URL = 'https://snapshot.org/#/venus-xvs.eth';

export interface VotingWalletProps {
  className?: string;
}

const VotingWallet: React.FC<VotingWalletProps> = ({ className }) => {
  const [delegateModelIsOpen, setDelegateModelIsOpen] = useState(false);
  const { accountAddress } = useAccountAddress();
  const isUserConnected = !!accountAddress;

  const { openAuthModal } = useAuthModal();
  const handleOpenAuthModal = () =>
    openAuthModal({
      analyticVariant: 'vote_wallet_section',
    });

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const { data: currentVotesData, isLoading: areCurrentVotesLoading } = useGetCurrentVotes(
    { accountAddress: accountAddress || NULL_ADDRESS },
    { enabled: !!accountAddress },
  );
  const votingWeightMantissa = currentVotesData?.votesMantissa || new BigNumber(0);

  const { data: delegateData, isLoading: isGetVoteDelegateAddressLoading } =
    useGetVoteDelegateAddress(
      { accountAddress: accountAddress || NULL_ADDRESS },
      { enabled: !!accountAddress },
    );
  const delegate = delegateData?.delegateAddress;

  const { data: vaults, isLoading: isGetVestingVaultsLoading } = useGetVestingVaults({
    accountAddress,
  });

  const xvsVault = xvs && vaults.find(v => areTokensEqual(v.stakedToken, xvs));
  const userStakedMantissa = xvsVault?.userStakedMantissa || new BigNumber(0);

  const { mutateAsync: setVoteDelegation, isPending: isVoteDelegationLoading } = useSetVoteDelegate(
    {
      onSuccess: () => setDelegateModelIsOpen(false),
    },
  );

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

  const isDataLoading =
    areCurrentVotesLoading ||
    isGetVoteDelegateAddressLoading ||
    isGetVestingVaultsLoading ||
    isVoteDelegationLoading;

  const previouslyDelegated = !!delegate;
  const userHasLockedXVS = userStakedMantissa.isGreaterThan(0);
  const showDepositXvs =
    !isDataLoading && isUserConnected && !userHasLockedXVS && voteProposalFeatureEnabled;
  const showDelegateButton =
    !isDataLoading && isUserConnected && userHasLockedXVS && voteProposalFeatureEnabled;

  return (
    <div className={cn('flex flex-col', className)}>
      <h4 className="text-lg font-semibold">{t('vote.votingWallet')}</h4>

      {!voteProposalFeatureEnabled && (
        <NoticeInfo
          className="mt-4 w-full md:mt-6"
          data-testid={TEST_IDS.votingDisabledWarning}
          title={t('vote.omnichain.votingOnlyEnabledOnBnb')}
          description={
            config.isSafeApp ? undefined : (
              <Button
                className="h-auto"
                variant="text"
                onClick={() => switchChain({ chainId: governanceChainId })}
              >
                {t('vote.omnichain.switchToBnb')}
              </Button>
            )
          }
        />
      )}

      <Card className="mt-6 flex flex-col px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:py-10 lg:flex-col lg:items-start lg:py-6">
        <div className="border-r-[#21293A] pb-4 sm:border-r sm:pb-0 sm:pr-[26px] md:pr-10 lg:border-r-0 lg:pb-4">
          <p className="text-grey text-base font-semibold sm:text-sm md:text-base">
            {t('vote.votingWeight')}
          </p>

          <h3 className="text-xl sm:text-lg md:text-xl" data-testid={TEST_IDS.votingWeightValue}>
            {readableVoteWeight}
          </h3>
        </div>

        <Delimiter className="w-full sm:hidden lg:block" />

        <div className="mt-4 sm:ml-[26px] sm:mr-auto sm:mt-0 md:ml-10 lg:ml-0 lg:mr-0 lg:mt-4">
          <div className="mb-1 flex items-end sm:mb-0 lg:mb-1">
            <p className="text-grey mr-2 text-base font-semibold sm:text-sm md:text-base">
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

        {!isUserConnected && (
          <PrimaryButton
            className="text-white mt-6 sm:mt-0 lg:mt-6 lg:w-full"
            onClick={handleOpenAuthModal}
          >
            {t('connectWallet.connectButton')}
          </PrimaryButton>
        )}

        {showDepositXvs && (
          <ButtonWrapper
            className="text-white mt-6 hover:no-underline sm:mt-0 sm:w-auto lg:mt-6 lg:w-full"
            asChild
          >
            <Link to={routes.vaults.path}>{t('vote.depositXvs')}</Link>
          </ButtonWrapper>
        )}

        {showDelegateButton && (
          <PrimaryButton
            className="text-white mt-6 sm:mt-0 sm:w-auto lg:mt-6 lg:w-full"
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
            className="text-white mt-6 w-full hover:no-underline"
            asChild
          >
            <Link href={XVS_SNAPSHOT_URL}>
              <Icon className="mr-2 h-6 w-6" name="lightning" />
              {t('vote.goToXvsSnapshot')}
            </Link>
          </ButtonWrapper>

          <DelegateModal
            onClose={() => setDelegateModelIsOpen(false)}
            isOpen={delegateModelIsOpen}
            currentUserAccountAddress={accountAddress}
            previouslyDelegated={previouslyDelegated}
            setVoteDelegation={setVoteDelegation}
            isVoteDelegationLoading={isVoteDelegationLoading}
          />
        </>
      )}
    </div>
  );
};

export default VotingWallet;
