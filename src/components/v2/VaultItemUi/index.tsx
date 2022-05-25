// VaultItemUi
/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { useTranslation } from 'translation';
import {
  convertWeiToCoins,
  formatCommaThousandsPeriodDecimal,
  formatToReadablePercentage,
} from 'utilities/common';
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
  const classes = useStyles();
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
            <Icon css={classes.tokenIcon} name={rewardTokenId} />
            {formatCommaThousandsPeriodDecimal(
              convertWeiToCoins({
                valueWei: dailyEmissionWei,
                tokenId: rewardTokenId,
                returnInReadableFormat: true,
              }),
            )}
          </>
        ),
      },
      {
        title: t('vaultItemUi.totalStaked'),
        value: (
          <>
            <Icon css={classes.tokenIcon} name={tokenId} />
            {formatCommaThousandsPeriodDecimal(
              convertWeiToCoins({
                valueWei: totalStakedWei,
                tokenId,
                returnInReadableFormat: true,
              }),
            )}
          </>
        ),
      },
    ],
    [tokenId, rewardTokenId, stakingAprPercentage, dailyEmissionWei, totalStakedWei],
  );

  return (
    <Paper css={classes.container} className={className}>
      <div css={classes.header}>
        <div css={classes.title}>
          <Icon css={classes.tokenIcon} name={tokenId} />
          <Typography variant="h4" css={classes.text}>
            {getToken(tokenId).symbol}
          </Typography>
        </div>

        {rewardWei?.isGreaterThan(0) && (
          <div css={classes.rewardWrapper}>
            <Typography css={[classes.text, classes.textMobile14]}>
              {t('vaultItemUi.reward')}
            </Typography>
            <Icon css={[classes.tokenIcon, classes.tokenIconReward]} name={rewardTokenId} />
            <Typography
              css={[classes.text, classes.textRewardValue, classes.textMobile14]}
              variant="body1"
              color="textPrimary"
            >
              {convertWeiToCoins({
                valueWei: rewardWei,
                tokenId: rewardTokenId,
                returnInReadableFormat: true,
              })}
            </Typography>
            <Button onClick={onClaim} variant="text" css={classes.buttonClaim}>
              {t('vaultItemUi.claimButton')}
            </Button>
          </div>
        )}
      </div>

      <Typography css={classes.textMobile14}>{t('vaultItemUi.youAreStaking')}</Typography>
      <Typography variant="h1" css={classes.textStakingValue}>
        <Icon css={[classes.tokenIcon, classes.tokenIconLarge]} name={tokenId} />
        {convertWeiToCoins({
          tokenId,
          valueWei: userStakedWei,
          returnInReadableFormat: true,
        })}
      </Typography>

      <ul css={classes.dataRow}>
        {dataListItems.map(({ title, value }) => (
          <li key={title} css={classes.valueWrapper}>
            <Typography css={classes.textMobile14}>{title}</Typography>
            <Typography variant="h4" css={[classes.textAligned, classes.textMobile14]}>
              {value}
            </Typography>
          </li>
        ))}
      </ul>

      <div css={classes.buttonsWrapper}>
        <Button onClick={onStake} css={classes.button} variant="primary">
          {t('vaultItemUi.stakeButton')}
        </Button>
        <Button onClick={onReward} css={classes.button} variant="secondary">
          {t('vaultItemUi.withdrawButton')}
        </Button>
      </div>
    </Paper>
  );
};

export default VaultItemUi;
