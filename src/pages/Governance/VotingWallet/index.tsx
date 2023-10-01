/** @jsxImportSource @emotion/react */
import { Paper, Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import {
  Delimiter,
  Icon,
  InfoIcon,
  LinkButton,
  PrimaryButton,
  SecondaryAnchorButton,
  TokenIcon,
} from 'components';
import { ContractReceipt } from 'ethers';
import { useGetToken } from 'packages/tokens';
import React, { Suspense, lazy, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'translation';
import { Token } from 'types';
import { areTokensEqual, convertWeiToTokens } from 'utilities';

import {
  useGetCurrentVotes,
  useGetVestingVaults,
  useGetVoteDelegateAddress,
  useSetVoteDelegate,
} from 'clients/api';
import { routes } from 'constants/routing';
import { XVS_SNAPSHOT_URL } from 'constants/xvsSnapshotUrl';
import { useAuth } from 'context/AuthContext';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';

import { useStyles } from './styles';
import TEST_IDS from './testIds';

const DelegateModal = lazy(() => import('./DelegateModal'));

interface VotingWalletUiProps {
  votingWeightWei: BigNumber;
  openAuthModal: () => void;
  userStakedWei: BigNumber;
  connectedWallet: boolean;
  currentUserAccountAddress: string | undefined;
  delegate: string | undefined;
  setVoteDelegation: (address: string) => Promise<ContractReceipt>;
  isVoteDelegationLoading: boolean;
  delegateModelIsOpen: boolean;
  setDelegateModelIsOpen: (open: boolean) => void;
  xvs?: Token;
}

export const VotingWalletUi: React.FC<VotingWalletUiProps> = ({
  xvs,
  votingWeightWei,
  userStakedWei,
  connectedWallet,
  openAuthModal,
  currentUserAccountAddress,
  delegate,
  setVoteDelegation,
  isVoteDelegationLoading,
  delegateModelIsOpen,
  setDelegateModelIsOpen,
}) => {
  const { t, Trans } = useTranslation();
  const styles = useStyles();

  const readableXvsLocked = useMemo(
    () =>
      convertWeiToTokens({
        valueWei: userStakedWei,
        token: xvs,
        returnInReadableFormat: true,
        addSymbol: false,
      }),
    [userStakedWei, xvs],
  );

  const readableVoteWeight = useMemo(
    () =>
      convertWeiToTokens({
        valueWei: votingWeightWei,
        token: xvs,
        returnInReadableFormat: true,
        addSymbol: false,
      }),
    [votingWeightWei, xvs],
  );

  const previouslyDelegated = !!delegate;
  const userHasLockedXVS = userStakedWei.isGreaterThan(0);
  return (
    <div css={styles.root}>
      <Typography variant="h4">{t('vote.votingWallet')}</Typography>

      <Paper css={styles.votingWalletPaper}>
        <div css={styles.votingWeightContainer}>
          <Typography variant="body2" css={styles.subtitle}>
            {t('vote.votingWeight')}
          </Typography>

          <Typography variant="h3" css={styles.value} data-testid={TEST_IDS.votingWeightValue}>
            {readableVoteWeight}
          </Typography>
        </div>

        <Delimiter css={styles.delimiter} />

        <div css={styles.totalLockedContainer}>
          <div css={styles.totalLockedTitle}>
            <Typography variant="body2" css={[styles.subtitle, styles.totalLockedText]}>
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
          <PrimaryButton css={styles.actionButton} onClick={openAuthModal}>
            {t('connectWallet.connectButton')}
          </PrimaryButton>
        )}

        {connectedWallet && !userHasLockedXVS && (
          <LinkButton css={styles.actionButton} to={routes.vaults.path}>
            {t('vote.depositXvs')}
          </LinkButton>
        )}

        {connectedWallet && userHasLockedXVS && (
          <PrimaryButton css={styles.actionButton} onClick={() => setDelegateModelIsOpen(true)}>
            {previouslyDelegated ? t('vote.redelegate') : t('vote.delegate')}
          </PrimaryButton>
        )}
      </Paper>

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

      <SecondaryAnchorButton
        href={XVS_SNAPSHOT_URL}
        target="_blank"
        rel="noreferrer"
        css={styles.snapshotButton}
      >
        <Icon css={styles.snapshotButtonIcon} name="lightening" />
        {t('vote.goToXvsSnapshot')}
      </SecondaryAnchorButton>

      <Suspense>
        <DelegateModal
          onClose={() => setDelegateModelIsOpen(false)}
          isOpen={delegateModelIsOpen}
          currentUserAccountAddress={currentUserAccountAddress}
          previouslyDelegated={previouslyDelegated}
          setVoteDelegation={setVoteDelegation}
          isVoteDelegationLoading={isVoteDelegationLoading}
          openAuthModal={openAuthModal}
        />
      </Suspense>
    </div>
  );
};

const VotingWallet: React.FC = () => {
  const [delegateModelIsOpen, setDelegateModelIsOpen] = useState(false);
  const { t } = useTranslation();
  const { accountAddress, openAuthModal } = useAuth();
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
  const userStakedWei = xvsVault?.userStakedWei || new BigNumber(0);

  const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();
  const { mutateAsync: setVoteDelegation, isLoading: isVoteDelegationLoading } = useSetVoteDelegate(
    {
      onSuccess: data => {
        setDelegateModelIsOpen(false);

        if (xvs) {
          openSuccessfulTransactionModal({
            title: t('vote.successfulDelegationModal.title'),
            content: t('vote.successfulDelegationModal.message'),
            amount: {
              valueWei: userStakedWei,
              token: xvs,
            },
            transactionHash: data.transactionHash,
          });
        }
      },
    },
  );

  return (
    <VotingWalletUi
      connectedWallet={!!accountAddress}
      openAuthModal={openAuthModal}
      currentUserAccountAddress={accountAddress}
      votingWeightWei={currentVotesData?.votesWei || new BigNumber(0)}
      userStakedWei={userStakedWei}
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
