/** @jsxImportSource @emotion/react */
import { Paper, Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import {
  Button,
  ButtonWrapper,
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
import { areTokensEqual, convertMantissaToTokens } from 'utilities';

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
import { useStyles } from './styles';
import TEST_IDS from './testIds';

interface VotingWalletUiProps {
  votingWeightMantissa: BigNumber;
  openAuthModal: () => void;
  userStakedMantissa: BigNumber;
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
  const styles = useStyles();

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
  return (
    <div css={styles.root}>
      <Typography variant="h4">{t('vote.votingWallet')}</Typography>

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

      <Paper css={styles.votingWalletPaper}>
        <div css={styles.votingWeightContainer}>
          <Typography variant="body2" css={styles.subtitle} className="text-grey">
            {t('vote.votingWeight')}
          </Typography>

          <Typography variant="h3" css={styles.value} data-testid={TEST_IDS.votingWeightValue}>
            {readableVoteWeight}
          </Typography>
        </div>

        <Delimiter css={styles.delimiter} />

        <div css={styles.totalLockedContainer}>
          <div css={styles.totalLockedTitle}>
            <Typography
              variant="body2"
              className="text-grey"
              css={[styles.subtitle, styles.totalLockedText]}
            >
              {t('vote.totalLocked')}
            </Typography>

            {previouslyDelegated && (
              <InfoIcon
                tooltip={t('vote.youDelegatedTo', { delegate })}
                css={[styles.infoIcon, styles.subtitle]}
              />
            )}
          </div>

          <div css={styles.totalLockedValue}>
            {xvs && <TokenIcon token={xvs} css={styles.tokenIcon} />}

            <Typography variant="h3" css={styles.value} data-testid={TEST_IDS.totalLockedValue}>
              {readableXvsLocked}
            </Typography>
          </div>
        </div>

        {!connectedWallet && (
          <PrimaryButton className="text-offWhite lg:w-full" onClick={openAuthModal}>
            {t('connectWallet.connectButton')}
          </PrimaryButton>
        )}

        {connectedWallet && !userHasLockedXVS && (
          <ButtonWrapper className="text-offWhite hover:no-underline sm:w-auto lg:w-full" asChild>
            <Link to={routes.vaults.path}>{t('vote.depositXvs')}</Link>
          </ButtonWrapper>
        )}

        {connectedWallet && userHasLockedXVS && voteProposalFeatureEnabled && (
          <PrimaryButton
            className="text-offWhite sm:w-auto lg:w-full"
            onClick={() => setDelegateModelIsOpen(true)}
            data-testid={TEST_IDS.delegateButton}
          >
            {previouslyDelegated ? t('vote.redelegate') : t('vote.delegate')}
          </PrimaryButton>
        )}
      </Paper>

      {voteProposalFeatureEnabled && (
        <>
          <Paper css={[styles.votingWalletPaper, styles.voteSection]}>
            <Typography variant="body2" color="textPrimary" css={styles.toVote}>
              {t('vote.toVoteYouShould')}
            </Typography>

            <Typography variant="small2" color="textPrimary" css={styles.depositTokens}>
              <Trans
                i18nKey="vote.depositYourTokens"
                components={{
                  Link: (
                    <Link
                      to={routes.vaults.path}
                      css={styles.clickableText}
                      data-testid={TEST_IDS.depositYourTokens}
                    />
                  ),
                }}
              />
            </Typography>

            <Typography variant="small2" color="textPrimary">
              <Trans
                i18nKey="vote.delegateYourVoting"
                components={{
                  Anchor: (
                    <span
                      css={styles.clickableText}
                      role="button"
                      aria-pressed="false"
                      tabIndex={0}
                      onClick={() => setDelegateModelIsOpen(true)}
                      data-testid={TEST_IDS.delegateYourVoting}
                    />
                  ),
                }}
              />
            </Typography>
          </Paper>

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

  const { data: currentVotesData } = useGetCurrentVotes(
    { accountAddress: accountAddress || '' },
    { enabled: !!accountAddress },
  );
  const { data: delegateData } = useGetVoteDelegateAddress(
    { accountAddress: accountAddress || '' },
    { enabled: !!accountAddress },
  );

  const { data: vaults } = useGetVestingVaults({ accountAddress });

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
