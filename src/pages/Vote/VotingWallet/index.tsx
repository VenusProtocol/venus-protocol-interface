/** @jsxImportSource @emotion/react */
import { Paper, Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import { Delimiter, InfoIcon, LinkButton, PrimaryButton, TokenIcon } from 'components';
import React, { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'translation';
import { areTokensEqual, convertWeiToTokens } from 'utilities';

import {
  useGetCurrentVotes,
  useGetVestingVaults,
  useGetVoteDelegateAddress,
  useSetVoteDelegate,
} from 'clients/api';
import { routes } from 'constants/routing';
import { TOKENS } from 'constants/tokens';
import { AuthContext } from 'context/AuthContext';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';

import DelegateModal from '../DelegateModal';
import { useStyles } from './styles';
import TEST_IDS from './testIds';

interface VotingWalletUiProps {
  votingWeightWei: BigNumber;
  openAuthModal: () => void;
  userStakedWei: BigNumber;
  connectedWallet: boolean;
  currentUserAccountAddress: string | undefined;
  delegate: string | undefined;
  setVoteDelegation: (address: string) => void;
  isVoteDelegationLoading: boolean;
  delegateModelIsOpen: boolean;
  setDelegateModelIsOpen: (open: boolean) => void;
}

export const VotingWalletUi: React.FC<VotingWalletUiProps> = ({
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
        token: TOKENS.xvs,
        returnInReadableFormat: true,
        addSymbol: false,
        minimizeDecimals: true,
      }),
    [userStakedWei],
  );

  const readableVoteWeight = useMemo(
    () =>
      convertWeiToTokens({
        valueWei: votingWeightWei,
        token: TOKENS.xvs,
        returnInReadableFormat: true,
        addSymbol: false,
        minimizeDecimals: true,
      }),
    [votingWeightWei],
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
            <TokenIcon token={TOKENS.xvs} css={styles.tokenIcon} />

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

      <DelegateModal
        onClose={() => setDelegateModelIsOpen(false)}
        isOpen={delegateModelIsOpen}
        currentUserAccountAddress={currentUserAccountAddress}
        previouslyDelegated={previouslyDelegated}
        setVoteDelegation={setVoteDelegation}
        isVoteDelegationLoading={isVoteDelegationLoading}
        openAuthModal={openAuthModal}
      />
    </div>
  );
};

const VotingWallet: React.FC = () => {
  const [delegateModelIsOpen, setDelegateModelIsOpen] = useState(false);
  const { t } = useTranslation();
  const { account: { address: accountAddress } = { address: undefined }, openAuthModal } =
    useContext(AuthContext);

  const { data: currentVotesData } = useGetCurrentVotes(
    { accountAddress: accountAddress || '' },
    { enabled: !!accountAddress },
  );
  const { data: delegateData } = useGetVoteDelegateAddress(
    { accountAddress: accountAddress || '' },
    { enabled: !!accountAddress },
  );

  const { data: vaults } = useGetVestingVaults({ accountAddress });

  const xvsVault = vaults.find(v => areTokensEqual(v.stakedToken, TOKENS.xvs));
  const userStakedWei = xvsVault?.userStakedWei || new BigNumber(0);

  const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();
  const { mutateAsync: setVoteDelegation, isLoading: isVoteDelegationLoading } = useSetVoteDelegate(
    {
      onSuccess: data => {
        setDelegateModelIsOpen(false);
        openSuccessfulTransactionModal({
          title: t('vote.successfulDelegationModal.title'),
          content: t('vote.successfulDelegationModal.message'),
          amount: {
            valueWei: userStakedWei,
            token: TOKENS.xvs,
          },
          transactionHash: data.transactionHash,
        });
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
      setVoteDelegation={(delegateAddress: string) =>
        setVoteDelegation({ delegateAddress, accountAddress: accountAddress || '' })
      }
      isVoteDelegationLoading={isVoteDelegationLoading}
      delegateModelIsOpen={delegateModelIsOpen}
      setDelegateModelIsOpen={setDelegateModelIsOpen}
    />
  );
};

export default VotingWallet;
