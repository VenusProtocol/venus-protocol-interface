/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import BigNumber from 'bignumber.js';
import { useMemo, useState } from 'react';

import { useGetPrimeStatus } from 'clients/api';
import { Card } from 'components';
import { Button, NoticeWarning, TokenIcon } from 'components';
import { AddTokenToWalletButton } from 'containers/AddTokenToWalletButton';
import PrimeStatusBanner from 'containers/PrimeStatusBanner';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { Token } from 'types';
import { convertMantissaToTokens, formatPercentageToReadableValue } from 'utilities';

import { NULL_ADDRESS } from 'constants/address';
import { StakeModal, WithdrawFromVaiVaultModal, WithdrawFromVestingVaultModal } from '../modals';
import { useStyles } from './styles';
import TEST_IDS from './testIds';

type ActiveModal = 'stake' | 'withdraw';

export interface VaultItemUiProps {
  stakedToken: Token;
  rewardToken: Token;
  stakingAprPercentage: number;
  dailyEmissionMantissa: BigNumber;
  totalStakedMantissa: BigNumber;
  onStake: () => void;
  onWithdraw: () => void;
  closeActiveModal: () => void;
  isPaused: boolean;
  canWithdraw?: boolean;
  poolIndex?: number;
  activeModal?: ActiveModal;
  userStakedMantissa?: BigNumber;
  userHasPendingWithdrawalsFromBeforeUpgrade?: boolean;
  className?: string;
}

export const VaultItemUi: React.FC<VaultItemUiProps> = ({
  stakedToken,
  rewardToken,
  userStakedMantissa,
  stakingAprPercentage,
  dailyEmissionMantissa,
  totalStakedMantissa,
  onStake,
  onWithdraw,
  isPaused,
  canWithdraw = true,
  activeModal,
  poolIndex,
  closeActiveModal,
  userHasPendingWithdrawalsFromBeforeUpgrade,
  className,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const { accountAddress } = useAccountAddress();
  const isPrimeEnabled = useIsFeatureEnabled({ name: 'prime' });
  const { data: getPrimeStatusData } = useGetPrimeStatus(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
    },
    {
      enabled: !!accountAddress,
    },
  );
  const primePoolIndex = getPrimeStatusData?.xvsVaultPoolId;

  const readableUserStakedTokens = useConvertMantissaToReadableTokenString({
    token: stakedToken,
    value: userStakedMantissa || new BigNumber(0),
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
          <div className="flex items-center gap-x-1 sm:gap-x-2">
            <TokenIcon css={styles.tokenIcon} token={rewardToken} />

            <span>
              {convertMantissaToTokens({
                value: dailyEmissionMantissa,
                token: rewardToken,
                returnInReadableFormat: true,

                addSymbol: false,
              })}
            </span>
          </div>
        ),
      },
      {
        title: t('vaultItem.totalStaked'),
        value: (
          <div className="flex items-center gap-x-1 sm:gap-x-2">
            <TokenIcon css={styles.tokenIcon} token={stakedToken} />

            <span>
              {convertMantissaToTokens({
                value: totalStakedMantissa,
                token: stakedToken,
                returnInReadableFormat: true,

                addSymbol: false,
              })}
            </span>
          </div>
        ),
      },
    ],
    [
      stakedToken,
      rewardToken,
      stakingAprPercentage,
      dailyEmissionMantissa,
      totalStakedMantissa,
      t,
      styles.tokenIcon,
    ],
  );

  return (
    <>
      <Card css={styles.container} className={className}>
        <div css={styles.header}>
          <div className="flex items-center gap-x-2">
            <TokenIcon css={styles.tokenIcon} token={stakedToken} />

            <Typography variant="h4" css={styles.text} data-testid={TEST_IDS.symbol}>
              {stakedToken.symbol}
            </Typography>

            <AddTokenToWalletButton
              className="shrink-0"
              isUserConnected={!!accountAddress}
              token={stakedToken}
            />
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

        {isPrimeEnabled && primePoolIndex !== undefined && poolIndex === primePoolIndex && (
          <PrimeStatusBanner className="bg-background p-4 sm:mt-2" hidePromotionalTitle />
        )}

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

        {(isPaused || userHasPendingWithdrawalsFromBeforeUpgrade) && (
          <NoticeWarning
            description={
              isPaused
                ? t('vaultItem.pausedWarning')
                : t('vaultItem.blockingPendingWithdrawalsWarning')
            }
            className="mt-6"
          />
        )}

        <div css={styles.buttonsWrapper}>
          <Button
            onClick={onStake}
            css={styles.button}
            variant="primary"
            disabled={isPaused || userHasPendingWithdrawalsFromBeforeUpgrade}
          >
            {t('vaultItem.stakeButton')}
          </Button>

          {canWithdraw && (
            <Button
              onClick={onWithdraw}
              css={styles.button}
              variant="secondary"
              disabled={isPaused}
            >
              {t('vaultItem.withdrawButton')}
            </Button>
          )}
        </div>
      </Card>

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
          userHasPendingWithdrawalsFromBeforeUpgrade={
            userHasPendingWithdrawalsFromBeforeUpgrade || false
          }
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
  const [activeModal, setActiveModal] = useState<ActiveModal | undefined>();

  const onStake = () => setActiveModal('stake');
  const onWithdraw = () => setActiveModal('withdraw');

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
        !vaultItemUiProps.userStakedMantissa ||
        vaultItemUiProps.userStakedMantissa.isGreaterThan(0)
      }
      {...vaultItemUiProps}
    />
  );
};

export default VaultItem;
