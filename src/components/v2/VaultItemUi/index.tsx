// VaultItemUi
/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { useTranslation } from 'translation';
import { convertWeiToCoins, formatToReadablePercentage } from 'utilities/common';
import { TokenId } from 'types';
import { getToken } from 'utilities';
import { Icon } from '../Icon';
import { Button } from '../Button';
import { useStyles } from './styles';

export interface IVaultItemUiProps {
  tokenId: TokenId;
  rewardTokenId: TokenId;
  rewardWei?: BigNumber;
  userStakedWei: BigNumber;
  stakingAprPercentage: number;
  dailyEmissionWei: BigNumber;
  totalStakedWei: BigNumber;
  onClaim: () => void;
  onStake: () => void;
  onReward: () => void;
  className?: string;
}

export const VaultItemUi = ({
  tokenId,
  rewardTokenId,
  rewardWei,
  userStakedWei,
  stakingAprPercentage,
  dailyEmissionWei,
  totalStakedWei,
  onClaim,
  onStake,
  onReward,
  className,
}: IVaultItemUiProps) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const dataListItems = useMemo(
    () => [
      {
        title: t('vaultItemUi.stakingApr', { stakeTokenName: getToken(tokenId).symbol }),
        value: formatToReadablePercentage(stakingAprPercentage),
      },
      {
        title: t('vaultItemUi.dailyEmission'),
        value: (
          <>
            <Icon css={styles.tokenIcon} name={rewardTokenId} />
            {convertWeiToCoins({
              valueWei: dailyEmissionWei,
              tokenId: rewardTokenId,
              returnInReadableFormat: true,
            })}
          </>
        ),
      },
      {
        title: t('vaultItemUi.totalStaked'),
        value: (
          <>
            <Icon css={styles.tokenIcon} name={tokenId} />
            {convertWeiToCoins({
              valueWei: totalStakedWei,
              tokenId,
              returnInReadableFormat: true,
            })}
          </>
        ),
      },
    ],
    [tokenId, rewardTokenId, stakingAprPercentage, dailyEmissionWei, totalStakedWei],
  );

  return (
    <Paper css={styles.container} className={className}>
      <div css={styles.header}>
        <div css={styles.title}>
          <Icon css={styles.tokenIcon} name={tokenId} />
          <Typography variant="h4" css={styles.text}>
            {getToken(tokenId).symbol}
          </Typography>
        </div>

        {rewardWei?.isGreaterThan(0) && (
          <div css={styles.rewardWrapper}>
            <Typography css={[styles.text, styles.textMobile14]}>
              {t('vaultItemUi.reward')}
            </Typography>
            <Icon css={[styles.tokenIcon, styles.tokenIconReward]} name={rewardTokenId} />
            <Typography
              css={[styles.text, styles.textRewardValue, styles.textMobile14]}
              variant="body1"
              color="textPrimary"
            >
              {convertWeiToCoins({
                valueWei: rewardWei,
                tokenId: rewardTokenId,
                returnInReadableFormat: true,
              })}
            </Typography>
            <Button onClick={onClaim} variant="text" css={styles.buttonClaim}>
              {t('vaultItemUi.claimButton')}
            </Button>
          </div>
        )}
      </div>

      <Typography css={styles.textMobile14}>{t('vaultItemUi.youAreStaking')}</Typography>
      <Typography variant="h1" css={styles.textStakingValue}>
        <Icon css={[styles.tokenIcon, styles.tokenIconLarge]} name={tokenId} />
        {convertWeiToCoins({
          tokenId,
          valueWei: userStakedWei,
          returnInReadableFormat: true,
        })}
      </Typography>

      <ul css={styles.dataRow}>
        {dataListItems.map(({ title, value }) => (
          <li key={title} css={styles.valueWrapper}>
            <Typography css={styles.textMobile14}>{title}</Typography>
            <Typography variant="h4" css={[styles.textAligned, styles.textMobile14]}>
              {value}
            </Typography>
          </li>
        ))}
      </ul>

      <div css={styles.buttonsWrapper}>
        <Button onClick={onStake} css={styles.button} variant="primary">
          {t('vaultItemUi.stakeButton')}
        </Button>
        <Button onClick={onReward} css={styles.button} variant="secondary">
          {t('vaultItemUi.withdrawButton')}
        </Button>
      </div>
    </Paper>
  );
};

export default VaultItemUi;
