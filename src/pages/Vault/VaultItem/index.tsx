// VaultItemUi

/** @jsxImportSource @emotion/react */
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import BigNumber from 'bignumber.js';
import { Button, NoticeWarning, TokenIcon } from 'components';
import { VError } from 'errors';
import React, { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'translation';
import { convertWeiToTokens, formatToReadablePercentage, unsafelyGetToken } from 'utilities';
import type { TransactionReceipt } from 'web3-core/types';

import { useWithdrawFromVrtVault } from 'clients/api';
import { TOKENS } from 'constants/tokens';
import { AuthContext } from 'context/AuthContext';
import { DisableLunaUstWarningContext } from 'context/DisableLunaUstWarning';
import useClaimVaultReward from 'hooks/useClaimVaultReward';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';

import { StakeModal, WithdrawFromVaiVaultModal, WithdrawFromVestingVaultModal } from '../modals';
import { useStyles } from './styles';
import TEST_IDS from './testIds';

type ActiveModal = 'stake' | 'withdraw';

export interface VaultItemUiProps {
  stakedTokenId: string;
  rewardTokenId: string;
  stakingAprPercentage: number;
  dailyEmissionWei: BigNumber;
  totalStakedWei: BigNumber;
  onClaimReward: () => Promise<TransactionReceipt | void>;
  onStake: () => void;
  onWithdraw: () => Promise<TransactionReceipt | void>;
  closeActiveModal: () => void;
  isClaimRewardLoading: boolean;
  canWithdraw?: boolean;
  isWithdrawLoading?: boolean;
  poolIndex?: number;
  activeModal?: ActiveModal;
  userPendingRewardWei?: BigNumber;
  userStakedWei?: BigNumber;
  hasPendingWithdrawalsFromBeforeUpgrade?: boolean;
  className?: string;
}

export const VaultItemUi: React.FC<VaultItemUiProps> = ({
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
  canWithdraw = true,
  activeModal,
  poolIndex,
  isClaimRewardLoading,
  isWithdrawLoading,
  closeActiveModal,
  hasPendingWithdrawalsFromBeforeUpgrade = false,
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

  const rewardToken = unsafelyGetToken(rewardTokenId);
  const stakedToken = unsafelyGetToken(stakedTokenId);

  const readableUserPendingRewardTokens = useConvertWeiToReadableTokenString({
    valueWei: userPendingRewardWei,
    token: rewardToken,
    minimizeDecimals: true,
    addSymbol: false,
  });

  const readableUserStakedTokens = useConvertWeiToReadableTokenString({
    token: stakedToken,
    valueWei: userStakedWei || new BigNumber(0),
    minimizeDecimals: true,
    addSymbol: false,
  });

  const dataListItems = useMemo(
    () => [
      {
        title: t('vaultItem.stakingApr', { stakeTokenName: stakedToken.symbol }),
        value: formatToReadablePercentage(stakingAprPercentage),
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
              shortenLargeValue: true,
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
    <>
      <Paper css={styles.container} className={className}>
        <div css={styles.header}>
          <div css={styles.title}>
            <TokenIcon css={styles.tokenIcon} token={stakedToken} />

            <Typography variant="h4" css={styles.text} data-testid={TEST_IDS.symbol}>
              {unsafelyGetToken(stakedTokenId).symbol}
            </Typography>
          </div>

          {userPendingRewardWei?.isGreaterThan(0) && (
            <div css={styles.rewardWrapper}>
              <Typography css={[styles.text, styles.textSmallMobile]}>
                {t('vaultItem.reward')}
              </Typography>

              <TokenIcon css={[styles.tokenIcon, styles.tokenIconWithdraw]} token={rewardToken} />

              <Typography
                css={[styles.text, styles.textRewardValue, styles.textSmallMobile]}
                variant="body1"
                color="textPrimary"
                data-testid={TEST_IDS.userPendingRewardTokens}
              >
                {readableUserPendingRewardTokens}
              </Typography>

              <Button
                onClick={handleClaimReward}
                variant="text"
                css={styles.buttonClaim}
                loading={isClaimRewardLoading}
                disabled={hasPendingWithdrawalsFromBeforeUpgrade}
              >
                {t('vaultItem.claimButton')}
              </Button>
            </div>
          )}
        </div>

        <Typography variant="small2" css={[styles.label, styles.stakingLabel]}>
          {t('vaultItem.youAreStaking')}
        </Typography>

        <Typography
          variant="h1"
          css={styles.textStakingValue}
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
            <Button
              onClick={handleWithdraw}
              css={styles.button}
              variant="secondary"
              loading={isWithdrawLoading}
            >
              {t('vaultItem.withdrawButton')}
            </Button>
          )}
        </div>
      </Paper>

      {activeModal === 'stake' && (
        <StakeModal
          stakedTokenId={stakedTokenId}
          rewardTokenId={rewardTokenId}
          handleClose={closeActiveModal}
          poolIndex={poolIndex}
        />
      )}

      {activeModal === 'withdraw' && poolIndex === undefined && stakedTokenId === TOKENS.vai.id && (
        <WithdrawFromVaiVaultModal handleClose={closeActiveModal} />
      )}

      {activeModal === 'withdraw' && poolIndex !== undefined && (
        <WithdrawFromVestingVaultModal
          handleClose={closeActiveModal}
          stakedTokenId={stakedTokenId}
          poolIndex={poolIndex}
          hasPendingWithdrawalsFromBeforeUpgrade={hasPendingWithdrawalsFromBeforeUpgrade}
        />
      )}
    </>
  );
};

export type VaultItemProps = Omit<
  VaultItemUiProps,
  | 'onClaimReward'
  | 'onStake'
  | 'onWithdraw'
  | 'closeActiveModal'
  | 'activeModal'
  | 'isClaimRewardLoading'
  | 'isWithdrawLoading'
>;

const VaultItem: React.FC<VaultItemProps> = ({
  stakedTokenId,
  rewardTokenId,
  poolIndex,
  ...vaultItemUiProps
}) => {
  const { account } = useContext(AuthContext);

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

  const { mutateAsync: withdrawFromVrtVault, isLoading: isWithdrawFromVrtVault } =
    useWithdrawFromVrtVault();

  const onWithdraw = async () => {
    // Block action is user has LUNA or UST enabled as collateral
    if (hasLunaOrUstCollateralEnabled) {
      openLunaUstWarningModal();
      return;
    }

    if (stakedTokenId !== TOKENS.vrt.id || typeof poolIndex === 'number') {
      // Handle withdrawing from any vault except the VRT non-vesting vault
      setActiveModal('withdraw');
      return;
    }

    // Handle withdrawing from VRT non-vesting vault
    if (!account?.address) {
      throw new VError({ type: 'interaction', code: 'accountError' });
    }

    // Users can only withdraw the totality of their staked tokens when
    // withdrawing from the VRT non-vesting vault
    return withdrawFromVrtVault({
      fromAccountAddress: account.address,
    });
  };

  const closeActiveModal = () => setActiveModal(undefined);

  const { claimReward, isLoading: isClaimRewardLoading } = useClaimVaultReward();
  const onClaimReward = async () => {
    // Block action is user has LUNA or UST enabled as collateral
    if (hasLunaOrUstCollateralEnabled) {
      openLunaUstWarningModal();
      return;
    }

    return claimReward({
      stakedTokenId,
      rewardTokenId,
      poolIndex,
      // account.address has to exist at this point since users are prompted to
      // connect their wallet before they're able to stake
      accountAddress: account?.address || '',
    });
  };

  return (
    <VaultItemUi
      onClaimReward={onClaimReward}
      isClaimRewardLoading={isClaimRewardLoading}
      onStake={onStake}
      onWithdraw={onWithdraw}
      activeModal={activeModal}
      closeActiveModal={closeActiveModal}
      stakedTokenId={stakedTokenId}
      rewardTokenId={rewardTokenId}
      poolIndex={poolIndex}
      // Hide withdraw button of non-vesting VRT vault when user doesn't have
      // any tokens staked in it
      canWithdraw={
        stakedTokenId !== TOKENS.vrt.id ||
        typeof poolIndex === 'number' ||
        !vaultItemUiProps.userStakedWei ||
        vaultItemUiProps.userStakedWei.isGreaterThan(0)
      }
      // We only track the loading state of a withdrawal for the VRT vault,
      // since all the other vaults handle that through a modal
      isWithdrawLoading={isWithdrawFromVrtVault}
      {...vaultItemUiProps}
    />
  );
};

export default VaultItem;
