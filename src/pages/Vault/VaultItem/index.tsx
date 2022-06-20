// VaultItemUi
/** @jsxImportSource @emotion/react */
import React, { useMemo, useState, useContext } from 'react';
import BigNumber from 'bignumber.js';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { TransactionReceipt } from 'web3-core/types';

import { VError } from 'errors';
import { TOKENS } from 'constants/tokens';
import { AuthContext } from 'context/AuthContext';
import { useTranslation } from 'translation';
import useConvertToReadableCoinString from 'hooks/useConvertToReadableCoinString';
import { convertWeiToCoins, formatToReadablePercentage, getToken } from 'utilities';
import TEST_IDS from 'constants/testIds';
import { TokenId } from 'types';
import { Icon, Button } from 'components';
import { StakeModal, WithdrawFromVaiVaultModal, WithdrawFromVestingVaultModal } from '../modals';
import { useStyles } from './styles';

type ActiveModal = 'stake' | 'withdraw';

export interface IVaultItemUiProps {
  stakedTokenId: TokenId;
  rewardTokenId: TokenId;
  stakingAprPercentage: number;
  dailyEmissionWei: BigNumber;
  totalStakedWei: BigNumber;
  onClaimReward: () => Promise<TransactionReceipt>;
  onStake: () => void;
  onWithdraw: () => Promise<TransactionReceipt | void>;
  closeActiveModal: () => void;
  isClaimRewardLoading: boolean;
  isWithdrawLoading?: boolean;
  poolIndex?: number;
  activeModal?: ActiveModal;
  userPendingRewardWei?: BigNumber;
  userStakedWei?: BigNumber;
  className?: string;
}

export const VaultItemUi: React.FC<IVaultItemUiProps> = ({
  stakedTokenId,
  rewardTokenId,
  userPendingRewardWei,
  userStakedWei,
  stakingAprPercentage,
  dailyEmissionWei,
  totalStakedWei,
  onClaimReward,
  onStake,
  onWithdraw,
  activeModal,
  poolIndex,
  isClaimRewardLoading,
  isWithdrawLoading,
  closeActiveModal,
  className,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const handleTransactionMutation = useHandleTransactionMutation();

  const handleClaimReward = () =>
    handleTransactionMutation({
      mutate: onClaimReward,
      successTransactionModalProps: transactionReceipt => ({
        title: t('vaultItem.successfulClaimRewardTransactionModal.title'),
        content: t('vaultItem.successfulClaimRewardTransactionModal.description'),
        transactionHash: transactionReceipt.transactionHash,
      }),
    });

  const handleWithdraw = () =>
    handleTransactionMutation({
      mutate: onWithdraw,
      successTransactionModalProps: transactionReceipt => ({
        title: t('vaultItem.successfulWithdrawVrtTransactionModal.title'),
        content: t('vaultItem.successfulWithdrawVrtTransactionModal.description'),
        transactionHash: transactionReceipt.transactionHash,
      }),
    });

  const readableUserPendingRewardTokens = useConvertWeiToReadableTokenString({
    valueWei: userPendingRewardWei,
    tokenId: rewardTokenId,
    minimizeDecimals: true,
    addSymbol: false,
  });

  const readableUserStakedTokens = useConvertWeiToReadableTokenString({
    tokenId: stakedTokenId,
    valueWei: userStakedWei || new BigNumber(0),
    minimizeDecimals: true,
    addSymbol: false,
  });

  const dataListItems = useMemo(
    () => [
      {
        title: t('vaultItem.stakingApr', { stakeTokenName: getToken(stakedTokenId).symbol }),
        value: formatToReadablePercentage(stakingAprPercentage),
      },
      {
        title: t('vaultItem.dailyEmission'),
        value: (
          <>
            <Icon css={styles.tokenIcon} name={rewardTokenId} />
            {convertWeiToTokens({
              valueWei: dailyEmissionWei,
              tokenId: rewardTokenId,
              returnInReadableFormat: true,
              minimizeDecimals: true,
              addSymbol: false,
            })}
          </>
        ),
      },
      {
        title: t('vaultItem.totalStaked'),
        value: (
          <>
            <Icon css={styles.tokenIcon} name={stakedTokenId} />
            {convertWeiToTokens({
              valueWei: totalStakedWei,
              tokenId: stakedTokenId,
              returnInReadableFormat: true,
              minimizeDecimals: true,
              shortenLargeValue: true,
              addSymbol: false,
            })}
          </>
        ),
      },
    ],
    [
      stakedTokenId,
      rewardTokenId,
      stakingAprPercentage,
      dailyEmissionWei.toFixed(),
      totalStakedWei.toFixed(),
    ],
  );

  return (
    <Paper css={styles.container} className={className}>
      <div css={styles.header}>
        <div css={styles.title}>
          <Icon css={styles.tokenIcon} name={stakedTokenId} />

          <Typography variant="h4" css={styles.text} data-testid={TEST_IDS.vault.vaultItem.symbol}>
            {getToken(stakedTokenId).symbol}
          </Typography>
        </div>

        {userPendingRewardWei?.isGreaterThan(0) && (
          <div css={styles.rewardWrapper}>
            <Typography css={styles.text}>{t('vaultItem.reward')}</Typography>

            <Icon css={[styles.tokenIcon, styles.tokenIconReward]} name={rewardTokenId} />

            <Typography
              css={[styles.text, styles.textRewardValue]}
              variant="body1"
              color="textPrimary"
              data-testid={TEST_IDS.vault.vaultItem.userPendingRewardTokens}
            >
              {getToken(stakedTokenId).symbol}
            </Typography>
          </div>
        )}
      </div>

      <Typography variant="small2" css={[styles.label, styles.stakingLabel]}>
        {t('vaultItem.youAreStaking')}
      </Typography>

      <Typography
        variant="h1"
        css={styles.textStakingValue}
        data-testid={TEST_IDS.vault.vaultItem.userStakedTokens}
      >
        <Icon css={[styles.tokenIconLarge]} name={stakedTokenId} />

        {readableUserStakedTokens}
      </Typography>

      <ul css={styles.dataRow}>
        {dataListItems.map(({ title, value }) => (
          <li key={title} css={styles.valueWrapper}>
            <Typography variant="small2" css={styles.label}>
              {title}
            </Typography>

            <Typography
              variant="h4"
              css={styles.textAligned}
              data-testid={TEST_IDS.vault.vaultItem.dataListItem}
            >
              {value}
            </Typography>
          </li>
        ))}
      </ul>

      <div css={styles.buttonsWrapper}>
        <Button onClick={onStake} css={styles.button} variant="primary">
          {t('vaultItem.stakeButton')}
        </Button>

        <Button onClick={onReward} css={styles.button} variant="secondary">
          {t('vaultItem.withdrawButton')}
        </Button>
      </div>
    </Paper>
  );
};

export default VaultItem;
