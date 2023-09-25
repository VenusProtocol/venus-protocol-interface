// VaultItemUi

/** @jsxImportSource @emotion/react */
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import BigNumber from 'bignumber.js';
import { Button, NoticeWarning, TokenIcon } from 'components';
import React, { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'translation';
import { Token } from 'types';
import { convertWeiToTokens, formatPercentageToReadableValue } from 'utilities';

import { DisableLunaUstWarningContext } from 'context/DisableLunaUstWarning';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';

import { StakeModal, WithdrawFromVaiVaultModal, WithdrawFromVestingVaultModal } from '../modals';
import { useStyles } from './styles';
import TEST_IDS from './testIds';

type ActiveModal = 'stake' | 'withdraw';

export interface VaultItemUiProps {
  stakedToken: Token;
  rewardToken: Token;
  stakingAprPercentage: number;
  dailyEmissionWei: BigNumber;
  totalStakedWei: BigNumber;
  onStake: () => void;
  onWithdraw: () => void;
  closeActiveModal: () => void;
  canWithdraw?: boolean;
  poolIndex?: number;
  activeModal?: ActiveModal;
  userStakedWei?: BigNumber;
  hasPendingWithdrawalsFromBeforeUpgrade?: boolean;
  className?: string;
}

export const VaultItemUi: React.FC<VaultItemUiProps> = ({
  stakedToken,
  rewardToken,
  userStakedWei,
  stakingAprPercentage,
  dailyEmissionWei,
  totalStakedWei,
  onStake,
  onWithdraw,
  canWithdraw = true,
  activeModal,
  poolIndex,
  closeActiveModal,
  hasPendingWithdrawalsFromBeforeUpgrade,
  className,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const readableUserStakedTokens = useConvertWeiToReadableTokenString({
    token: stakedToken,
    valueWei: userStakedWei || new BigNumber(0),
    addSymbol: false,
  });

  const dataListItems = useMemo(
    () => [
      {
        title: t('vaultItem.stakingApr', { stakeTokenName: stakedToken.symbol }),
        value: formatPercentageToReadableValue(stakingAprPercentage),
      },
      {
        title: t('vaultItem.dailyEmission'),
        value: (
          <>
            <TokenIcon css={styles.tokenIcon} token={rewardToken} />
            {convertWeiToTokens({
              valueWei: dailyEmissionWei,
              token: rewardToken,
              returnInReadableFormat: true,

              addSymbol: false,
            })}
          </>
        ),
      },
      {
        title: t('vaultItem.totalStaked'),
        value: (
          <>
            <TokenIcon css={styles.tokenIcon} token={stakedToken} />
            {convertWeiToTokens({
              valueWei: totalStakedWei,
              token: stakedToken,
              returnInReadableFormat: true,

              addSymbol: false,
            })}
          </>
        ),
      },
    ],
    [
      stakedToken,
      rewardToken,
      stakingAprPercentage,
      dailyEmissionWei.toFixed(),
      totalStakedWei.toFixed(),
    ],
  );

  return (
    <>
      <Paper css={styles.container} className={className}>
        <div css={styles.header}>
          <div css={styles.title}>
            <TokenIcon css={styles.tokenIcon} token={stakedToken} />

            <Typography variant="h4" css={styles.text} data-testid={TEST_IDS.symbol}>
              {stakedToken.symbol}
            </Typography>
          </div>
        </div>

        <Typography variant="small2" css={[styles.label, styles.stakingLabel]}>
          {t('vaultItem.youAreStake')}
        </Typography>

        <Typography
          variant="h1"
          css={styles.textStakeValue}
          data-testid={TEST_IDS.userStakedTokens}
        >
          <TokenIcon css={[styles.tokenIconLarge]} token={stakedToken} />

          {readableUserStakedTokens}
        </Typography>

        <ul css={styles.dataRow}>
          {dataListItems.map(({ title, value }) => (
            <li key={title} css={styles.valueWrapper}>
              <Typography variant="small2" css={[styles.label, styles.textSmallMobile]}>
                {title}
              </Typography>

              <Typography
                variant="h4"
                css={[styles.textAligned, styles.textSmallMobile]}
                data-testid={TEST_IDS.dataListItem}
              >
                {value}
              </Typography>
            </li>
          ))}
        </ul>

        {hasPendingWithdrawalsFromBeforeUpgrade && (
          <NoticeWarning description={t('vaultItem.blockingPendingWithdrawalsWarning')} />
        )}

        <div css={styles.buttonsWrapper}>
          <Button
            onClick={onStake}
            css={styles.button}
            variant="primary"
            disabled={hasPendingWithdrawalsFromBeforeUpgrade}
          >
            {t('vaultItem.stakeButton')}
          </Button>

          {canWithdraw && (
            <Button onClick={onWithdraw} css={styles.button} variant="secondary">
              {t('vaultItem.withdrawButton')}
            </Button>
          )}
        </div>
      </Paper>

      {activeModal === 'stake' && (
        <StakeModal
          stakedToken={stakedToken}
          rewardToken={rewardToken}
          handleClose={closeActiveModal}
          poolIndex={poolIndex}
        />
      )}

      {activeModal === 'withdraw' && poolIndex === undefined && stakedToken.symbol === 'VAI' && (
        <WithdrawFromVaiVaultModal handleClose={closeActiveModal} />
      )}

      {activeModal === 'withdraw' && poolIndex !== undefined && (
        <WithdrawFromVestingVaultModal
          handleClose={closeActiveModal}
          stakedToken={stakedToken}
          poolIndex={poolIndex}
          hasPendingWithdrawalsFromBeforeUpgrade={hasPendingWithdrawalsFromBeforeUpgrade || false}
        />
      )}
    </>
  );
};

export type VaultItemProps = Omit<
  VaultItemUiProps,
  'onStake' | 'onWithdraw' | 'closeActiveModal' | 'activeModal' | 'isWithdrawLoading'
>;

const VaultItem: React.FC<VaultItemProps> = ({
  stakedToken,
  rewardToken,
  poolIndex,
  ...vaultItemUiProps
}) => {
  const { hasLunaOrUstCollateralEnabled, openLunaUstWarningModal } = useContext(
    DisableLunaUstWarningContext,
  );

  const [activeModal, setActiveModal] = useState<ActiveModal | undefined>();
  const onStake = () => {
    // Block action is user has LUNA or UST enabled as collateral
    if (hasLunaOrUstCollateralEnabled) {
      openLunaUstWarningModal();
      return;
    }

    setActiveModal('stake');
  };

  const onWithdraw = async () => {
    // Block action is user has LUNA or UST enabled as collateral
    if (hasLunaOrUstCollateralEnabled) {
      openLunaUstWarningModal();
      return;
    }

    setActiveModal('withdraw');
  };

  const closeActiveModal = () => setActiveModal(undefined);

  return (
    <VaultItemUi
      onStake={onStake}
      onWithdraw={onWithdraw}
      activeModal={activeModal}
      closeActiveModal={closeActiveModal}
      stakedToken={stakedToken}
      rewardToken={rewardToken}
      poolIndex={poolIndex}
      // Hide withdraw button of non-vesting VRT vault when user doesn't have
      // any tokens staked in it
      canWithdraw={
        stakedToken.symbol !== 'VRT' ||
        typeof poolIndex === 'number' ||
        !vaultItemUiProps.userStakedWei ||
        vaultItemUiProps.userStakedWei.isGreaterThan(0)
      }
      {...vaultItemUiProps}
    />
  );
};

export default VaultItem;
