// VaultItemUi
/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { useTranslation } from 'translation';
import { formatCommaThousandsPeriodDecimal, formatToReadablePercentage } from 'utilities/common';
import { Icon } from '../Icon';
import { Button } from '../Button';
import { useStyles } from './styles';

type VaultAssetType = 'vai' | 'xvs' | 'vrt';

export interface IVaultItemUiProps {
  stakeTokenName: VaultAssetType;
  earnTokenName: VaultAssetType;
  rewardValue?: number;
  stakingValue: number;
  stakingAprValue: number;
  dailyEmissionValue: number;
  totalStakedValue: number;
  onClaim: () => void;
  onStake: () => void;
  onReward: () => void;
  className?: string;
}

export const VaultItemUi = ({
  stakeTokenName,
  earnTokenName,
  rewardValue,
  stakingValue,
  stakingAprValue,
  dailyEmissionValue,
  totalStakedValue,
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
        title: t('vaultItemUi.stakingApr', { stakeTokenName: stakeTokenName.toUpperCase() }),
        value: formatToReadablePercentage(stakingAprValue),
      },
      {
        title: t('vaultItemUi.dailyEmission'),
        value: (
          <>
            <Icon css={classes.tokenIcon} name={earnTokenName} />
            {formatCommaThousandsPeriodDecimal(dailyEmissionValue)}
          </>
        ),
      },
      {
        title: t('vaultItemUi.totalStaked'),
        value: (
          <>
            <Icon css={classes.tokenIcon} name={stakeTokenName} />
            {formatCommaThousandsPeriodDecimal(totalStakedValue)}
          </>
        ),
      },
    ],
    [stakeTokenName, earnTokenName, stakingAprValue, dailyEmissionValue, totalStakedValue],
  );

  return (
    <Paper css={classes.container} className={className}>
      <div css={classes.header}>
        <div css={classes.title}>
          <Icon css={classes.tokenIcon} name={stakeTokenName} />
          <Typography variant="h4" css={classes.text}>
            {stakeTokenName.toUpperCase()}
          </Typography>
        </div>

        {rewardValue && rewardValue > 0 && (
          <div css={classes.rewardWrapper}>
            <Typography css={[classes.text, classes.textMobile14]}>
              {t('vaultItemUi.reward')}
            </Typography>
            <Icon css={[classes.tokenIcon, classes.tokenIconReward]} name={earnTokenName} />
            <Typography
              css={[classes.text, classes.textRewardValue, classes.textMobile14]}
              variant="body1"
              color="textPrimary"
            >
              {rewardValue}
            </Typography>
            <Button onClick={onClaim} variant="text" css={classes.buttonClaim}>
              {t('vaultItemUi.claimButton')}
            </Button>
          </div>
        )}
      </div>

      <Typography css={classes.textMobile14}>{t('vaultItemUi.youAreStaking')}</Typography>
      <Typography variant="h1" css={classes.textStakingValue}>
        <Icon css={[classes.tokenIcon, classes.tokenIconLarge]} name={stakeTokenName} />
        {stakingValue}
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
