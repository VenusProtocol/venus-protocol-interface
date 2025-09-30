import { Spinner, cn } from '@venusprotocol/ui';

import { useSetEModeGroup } from 'clients/api';
import { Button, EModeIcon, InfoIcon } from 'components';
import { ConnectWallet } from 'containers/ConnectWallet';
import { SwitchChain } from 'containers/SwitchChain';
import { useAnalytics } from 'libs/analytics';
import { handleError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import type { Asset, EModeGroup, Pool } from 'types';
import { calculateHealthFactor } from 'utilities';
import { BlockingPositionModal } from './BlockingPositionModal';
import { HealthFactorUpdate } from './HealthFactorUpdate';

export interface HeaderProps {
  pool: Pool;
  eModeGroup: EModeGroup;
  userHasEnoughCollateral: boolean;
  userBlockingAssets: Asset[];
  hypotheticalUserHealthFactor: number;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  eModeGroup,
  userHasEnoughCollateral,
  userBlockingAssets,
  hypotheticalUserHealthFactor,
  pool,
  className,
}) => {
  const { t, Trans } = useTranslation();
  const { captureAnalyticEvent } = useAnalytics();

  const [isBlockingPositionModalOpen, setIsBlockingPositionModalOpen] = useState(false);
  const openBlockingPositionModal = () => {
    captureAnalyticEvent('e_mode_open_positions_modal', {});

    setIsBlockingPositionModalOpen(true);
  };

  const closeBlockingPositionModal = () => setIsBlockingPositionModalOpen(false);

  const { mutateAsync: mutateSetEModeGroup, isPending: isSetEModeGroupLoading } = useSetEModeGroup({
    waitForConfirmation: true,
  });

  const setEModeGroup = async (input: { eModeGroupId: number; eModeGroupName?: string }) => {
    try {
      await mutateSetEModeGroup({
        ...input,
        userEModeGroupName: pool.userEModeGroup?.name,
        comptrollerContractAddress: pool.comptrollerAddress,
      });
    } catch (error) {
      handleError({ error });
    }
  };

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

  const isButtonEnabled = userBlockingAssets.length === 0 && userHasEnoughCollateral;

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
  } else if (!isButtonEnabled && userBlockingAssets.length > 0) {
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

  const handleButtonClick = () => {
    // We can't disable the button when it contains an info icon, because it makes it unclickable on
    // mobile. So instead we keep it enabled, do nothing on click and style it as if it was disabled
    if (disabledTooltip) {
      return;
    }

    if (isEModeGroupEnabled) {
      return disableEModeGroup();
    }

    return enableEModeGroup();
  };

  return (
    <>
      <div className={cn('space-y-3', className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <h3 className="font-semibold lg:text-lg">{eModeGroup.name}</h3>

            {isEModeGroupEnabled && <EModeIcon />}
          </div>

          {isSetEModeGroupLoading ? (
            <Spinner variant="small" className="h-8" />
          ) : (
            <div className="flex items-center gap-x-4">
              {shouldDisplayHealthFactor &&
                !!poolUserHealthFactor &&
                !isEModeGroupEnabled &&
                isButtonEnabled &&
                hypotheticalUserHealthFactor !== undefined && (
                  <HealthFactorUpdate
                    className="hidden sm:flex"
                    healthFactor={poolUserHealthFactor}
                    hypotheticalHealthFactor={hypotheticalUserHealthFactor}
                  />
                )}

              <ConnectWallet analyticVariant="e_mode_tab" small>
                <SwitchChain small>
                  <Button
                    onClick={handleButtonClick}
                    small
                    disabled={!isButtonEnabled && !disabledTooltip}
                    variant={isEModeGroupEnabled && isButtonEnabled ? 'secondary' : 'primary'}
                    className={cn(
                      !!disabledTooltip &&
                        'pl-3 pr-4 bg-lightGrey border-lightGrey hover:bg-lightGrey hover:border-lightGrey active:bg-lightGrey active:border-lightGrey',
                    )}
                  >
                    {!!disabledTooltip && <InfoIcon className="mr-2" tooltip={disabledTooltip} />}

                    <span className={cn(!isButtonEnabled && 'opacity-50')}>{buttonLabel}</span>
                  </Button>
                </SwitchChain>
              </ConnectWallet>
            </div>
          )}
        </div>

        {shouldDisplayHealthFactor &&
          !!poolUserHealthFactor &&
          !isEModeGroupEnabled &&
          isButtonEnabled &&
          hypotheticalUserHealthFactor !== undefined && (
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
