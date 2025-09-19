import { cn } from '@venusprotocol/ui';

import { useSetEModeGroup } from 'clients/api';
import { Button, Icon, InfoIcon } from 'components';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import type { Asset, EModeGroup, Pool } from 'types';
import { areTokensEqual, calculateHealthFactor } from 'utilities';
import { BlockingPositionModal } from './BlockingPositionModal';
import { HealthFactorUpdate } from './HealthFactorUpdate';
import { getHypotheticalAssetValues } from './getHypotheticalAssetValues';

export interface HeaderProps {
  pool: Pool;
  eModeGroup: EModeGroup;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ eModeGroup, pool, className }) => {
  const { t, Trans } = useTranslation();

  const [isBlockingPositionModalOpen, setIsBlockingPositionModalOpen] = useState(false);
  const openBlockingPositionModal = () => setIsBlockingPositionModalOpen(true);
  const closeBlockingPositionModal = () => setIsBlockingPositionModalOpen(false);

  const { mutateAsync: mutateEModeGroup, isPending: isSetEModeGroupLoading } = useSetEModeGroup();

  const setEModeGroup = (input: { eModeGroupId: number; eModeGroupName?: string }) =>
    mutateEModeGroup({
      ...input,
      userEModeGroupName: pool.userEModeGroup?.name,
      comptrollerContractAddress: pool.comptrollerAddress,
    });

  const enableEModeGroup = () =>
    setEModeGroup({ eModeGroupId: eModeGroup.id, eModeGroupName: eModeGroup.name });

  // Setting the enabled E-mode group with ID 0 corresponds to disabling E-mode
  const disableEModeGroup = () => setEModeGroup({ eModeGroupId: 0 });

  const poolUserHealthFactor =
    pool.userLiquidationThresholdCents &&
    pool.userBorrowBalanceCents &&
    calculateHealthFactor({
      liquidationThresholdCents: pool.userLiquidationThresholdCents.toNumber(),
      borrowBalanceCents: pool.userBorrowBalanceCents.toNumber(),
    });

  const isEModeGroupEnabled = pool.userEModeGroup && pool.userEModeGroup.id === eModeGroup.id;

  // These values are used to determine if a user can enable the E-mode group if it's not enabled
  // already, or disable it if it's enabled
  const userBlockingAssets: Asset[] = [];
  let hypotheticalUserLiquidationThresholdCents = 0;
  let hypotheticalUserBorrowLimitCents = 0;
  let hypotheticalUserBorrowBalanceCents = 0;

  pool.assets.forEach(asset => {
    const assetSettings = eModeGroup.assetSettings.find(settings =>
      areTokensEqual(settings.vToken, asset.vToken),
    );

    const { isBlocking, liquidationThresholdCents, borrowLimitCents, borrowBalanceCents } =
      getHypotheticalAssetValues({
        userSupplyBalanceCents: asset.userSupplyBalanceCents.toNumber(),
        userBorrowBalanceCents: asset.userBorrowBalanceCents.toNumber(),
        isCollateralOfUser: asset.isCollateralOfUser,
        isBorrowable: isEModeGroupEnabled ? asset.isBorrowable : !!assetSettings?.isBorrowable,
        collateralFactor: isEModeGroupEnabled
          ? asset.collateralFactor
          : assetSettings?.collateralFactor ?? asset.collateralFactor,
        liquidationThresholdPercentage: isEModeGroupEnabled
          ? asset.liquidationThresholdPercentage
          : assetSettings?.liquidationThresholdPercentage ?? asset.liquidationThresholdPercentage,
      });

    if (isBlocking) {
      userBlockingAssets.push(asset);
    }

    hypotheticalUserLiquidationThresholdCents += liquidationThresholdCents;
    hypotheticalUserBorrowLimitCents += borrowLimitCents;
    hypotheticalUserBorrowBalanceCents += borrowBalanceCents;
  });

  const userHasBlockingPositions = userBlockingAssets.length > 0;
  const userHasEnoughCollateral =
    hypotheticalUserBorrowLimitCents >= hypotheticalUserBorrowBalanceCents;
  const isButtonEnabled = !userHasBlockingPositions && userHasEnoughCollateral;

  const hypotheticalUserHealthFactor = calculateHealthFactor({
    liquidationThresholdCents: hypotheticalUserLiquidationThresholdCents,
    borrowBalanceCents: hypotheticalUserBorrowBalanceCents,
  });

  const shouldDisplayHealthFactor =
    isButtonEnabled && !!pool.userBorrowBalanceCents?.isGreaterThan(0);

  let buttonLabel = t('pool.eMode.group.enableButtonLabel');

  if (isEModeGroupEnabled) {
    buttonLabel = t('pool.eMode.group.disableButtonLabel');
  } else if (pool.userEModeGroup) {
    buttonLabel = t('pool.eMode.group.switchButtonLabel');
  }

  let disabledTooltip: string | React.ReactNode | undefined;

  if (!isButtonEnabled && !userHasEnoughCollateral) {
    disabledTooltip = isEModeGroupEnabled
      ? t('pool.eMode.group.cannotDisable.tooltip.notEnoughCollateral')
      : t('pool.eMode.group.cannotEnable.tooltip.notEnoughCollateral');
  } else if (!isButtonEnabled && userHasBlockingPositions) {
    disabledTooltip = (
      <Trans
        i18nKey={
          isEModeGroupEnabled
            ? // Translation key: do not remove this comment
              // t('pool.eMode.group.cannotDisable.tooltip.blockingPositions')
              'pool.eMode.group.cannotDisable.tooltip.blockingPositions'
            : // Translation key: do not remove this comment
              // t('pool.eMode.group.cannotEnable.tooltip.blockingPositions')
              'pool.eMode.group.cannotEnable.tooltip.blockingPositions'
        }
        components={{
          Link: (
            <Button
              onClick={openBlockingPositionModal}
              variant="text"
              className="p-0 h-auto font-normal"
            />
          ),
        }}
      />
    );
  }

  return (
    <>
      <div className={cn('space-y-3', className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <h3 className="font-semibold lg:text-lg">{eModeGroup.name}</h3>

            {isEModeGroupEnabled && <Icon name="mark" className="text-green w-5 h-5" />}
          </div>

          <div className="flex items-center gap-x-4">
            {shouldDisplayHealthFactor &&
              !!poolUserHealthFactor &&
              !isEModeGroupEnabled &&
              isButtonEnabled && (
                <HealthFactorUpdate
                  className="hidden sm:flex"
                  healthFactor={poolUserHealthFactor}
                  hypotheticalHealthFactor={hypotheticalUserHealthFactor}
                />
              )}

            <Button
              onClick={isEModeGroupEnabled ? disableEModeGroup : enableEModeGroup}
              small
              disabled={!isButtonEnabled}
              loading={isSetEModeGroupLoading}
              variant={isEModeGroupEnabled && isButtonEnabled ? 'secondary' : 'primary'}
            >
              {!!disabledTooltip && <InfoIcon className="mr-2" tooltip={disabledTooltip} />}

              <span className={cn(!isEModeGroupEnabled && !isButtonEnabled && 'opacity-50')}>
                {buttonLabel}
              </span>
            </Button>
          </div>
        </div>

        {!!poolUserHealthFactor && !isEModeGroupEnabled && isButtonEnabled && (
          <HealthFactorUpdate
            className="sm:hidden"
            healthFactor={poolUserHealthFactor}
            hypotheticalHealthFactor={hypotheticalUserHealthFactor}
          />
        )}
      </div>

      {isBlockingPositionModalOpen && (
        <BlockingPositionModal
          onClose={closeBlockingPositionModal}
          blockingAssets={userBlockingAssets}
          eModeGroupName={eModeGroup.name}
          poolComptrollerAddress={pool.comptrollerAddress}
        />
      )}
    </>
  );
};
