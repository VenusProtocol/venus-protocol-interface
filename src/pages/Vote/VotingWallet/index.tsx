/** @jsxImportSource @emotion/react */
import React, { useContext, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import { Paper, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import {
  useGetVestingVaults,
  useGetCurrentVotes,
  useGetVoteDelegateAddress,
  useSetVoteDelegate,
} from 'clients/api';
import { AuthContext } from 'context/AuthContext';
import { Delimiter, Icon, LinkButton, PrimaryButton, Tooltip } from 'components';
import PATHS from 'constants/path';
import { XVS_TOKEN_ID } from 'constants/xvs';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import { useTranslation } from 'translation';
import { TokenId } from 'types';
import { convertWeiToTokens } from 'utilities';
import DelegateModal from '../DelegateModal';
import { useStyles } from './styles';

interface IVotingWalletUiProps {
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

export const VotingWalletUi: React.FC<IVotingWalletUiProps> = ({
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
        tokenId: 'xvs',
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
        tokenId: 'xvs',
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
          <Typography variant="h3" css={styles.value}>
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
              <Tooltip
                title={t('vote.youDelegatedTo', { delegate })}
                css={[styles.infoIcon, styles.subtitle]}
              >
                <Icon name="info" />
              </Tooltip>
            )}
          </div>
          <div css={styles.totalLockedValue}>
            <Icon name="xvs" css={styles.tokenIcon} />
            <Typography variant="h3" css={styles.value}>
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
          <LinkButton css={styles.actionButton} to={PATHS.VAULT}>
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
              Link: <Link to={PATHS.VAULT} css={styles.clickableText} />,
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
      />
    </div>
  );
};

const VotingWallet: React.FC = () => {
  const [delegateModelIsOpen, setDelegateModelIsOpen] = useState(false);
  const { t } = useTranslation();
  const { account: { address: accountAddress } = { address: undefined }, openAuthModal } =
    useContext(AuthContext);

  const { data: currentVotesWei } = useGetCurrentVotes(
    { accountAddress: accountAddress || '' },
    { enabled: !!accountAddress },
  );
  const { data: delegate } = useGetVoteDelegateAddress(
    { accountAddress: accountAddress || '' },
    { enabled: !!accountAddress },
  );

  const { data: vaults } = useGetVestingVaults({ accountAddress });
  const [xvsVault] = vaults.filter(v => v.stakedTokenId === XVS_TOKEN_ID);
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
            tokenId: XVS_TOKEN_ID as TokenId,
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
      votingWeightWei={currentVotesWei || new BigNumber(0)}
      userStakedWei={userStakedWei}
      delegate={delegate}
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
