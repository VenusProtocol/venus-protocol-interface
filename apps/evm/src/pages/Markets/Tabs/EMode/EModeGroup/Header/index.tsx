import { Spinner, cn } from '@venusprotocol/ui';

import { useSetEModeGroup } from 'clients/api';
import { Button, EModeIcon, InfoIcon, IsolatedEModeGroupTooltip, NoticeWarning } from 'components';
import { ConnectWallet } from 'containers/ConnectWallet';
import { SwitchChain } from 'containers/SwitchChain';
import { handleError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import type { EModeGroup, Pool } from 'types';
import type { BlockingBorrowPosition } from '../../../types';
import { BlockingPositionModal } from './BlockingPositionModal';
import { HealthFactorUpdate } from './HealthFactorUpdate';

export interface HeaderProps {
  pool: Pool;
  eModeGroup: EModeGroup;
  userHasEnoughCollateral: boolean;
  userBlockingBorrowPositions: BlockingBorrowPosition[];
  hypotheticalUserHealthFactor: number;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  eModeGroup,
  userHasEnoughCollateral,
  userBlockingBorrowPositions,
  hypotheticalUserHealthFactor,
  pool,
  className,
}) => {
  const { t, Trans } = useTranslation();

  const [isBlockingPositionModalOpen, setIsBlockingPositionModalOpen] = useState(false);
  const openBlockingPositionModal = () => setIsBlockingPositionModalOpen(true);

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

  const isEModeGroupEnabled = pool.userEModeGroup && pool.userEModeGroup.id === eModeGroup.id;

  const isButtonEnabled = userBlockingBorrowPositions.length === 0 && userHasEnoughCollateral;

  const shouldDisplayHealthFactor =
    isButtonEnabled && !!pool.userBorrowBalanceCents?.isGreaterThan(0);

  let buttonLabel = t('markets.tabs.eMode.group.enableButtonLabel');

  if (isEModeGroupEnabled) {
    buttonLabel = t('markets.tabs.eMode.group.disableButtonLabel');
  } else if (pool.userEModeGroup) {
    buttonLabel = t('markets.tabs.eMode.group.switchButtonLabel');
  }

  let disabledTooltip: string | React.ReactNode | undefined;

  if (!isButtonEnabled && !userHasEnoughCollateral) {
    disabledTooltip = isEModeGroupEnabled
      ? t('markets.tabs.eMode.group.cannotDisable.tooltip.notEnoughCollateral')
      : t('markets.tabs.eMode.group.cannotEnable.tooltip.notEnoughCollateral');
  } else if (!isButtonEnabled && userBlockingBorrowPositions.length > 0) {
    disabledTooltip = (
      <Trans
        i18nKey={
          isEModeGroupEnabled
            ? // Translation key: do not remove this comment
              // t('markets.tabs.eMode.group.cannotDisable.tooltip.blockingPositions')
              'markets.tabs.eMode.group.cannotDisable.tooltip.blockingPositions'
            : // Translation key: do not remove this comment
              // t('markets.tabs.eMode.group.cannotEnable.tooltip.blockingPositions')
              'markets.tabs.eMode.group.cannotEnable.tooltip.blockingPositions'
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
        {!eModeGroup.isActive && (
          <NoticeWarning description={t('markets.tabs.eMode.group.disabledNotice')} />
        )}

        <div className="flex items-center justify-between gap-x-2">
          <div className="flex items-center flex-wrap gap-x-2">
            <h3 className="font-semibold text-p2s">{eModeGroup.name}</h3>

            {eModeGroup.isIsolated && (
              <IsolatedEModeGroupTooltip eModeGroupName={eModeGroup.name} />
            )}

            {isEModeGroupEnabled && <EModeIcon />}
          </div>

          <div className="h-10 flex items-center">
            {isSetEModeGroupLoading ? (
              <Spinner variant="small" />
            ) : (
              <div className="flex items-center gap-x-4">
                {shouldDisplayHealthFactor &&
                  !!pool.userHealthFactor &&
                  !isEModeGroupEnabled &&
                  isButtonEnabled &&
                  hypotheticalUserHealthFactor !== undefined && (
                    <HealthFactorUpdate
                      className="hidden sm:flex"
                      healthFactor={pool.userHealthFactor}
                      hypotheticalHealthFactor={hypotheticalUserHealthFactor}
                    />
                  )}

                <ConnectWallet analyticVariant="e_mode_tab" buttonSize="sm">
                  <SwitchChain buttonSize="sm" className="whitespace-nowrap">
                    <Button
                      onClick={handleButtonClick}
                      size="sm"
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
        </div>

        {shouldDisplayHealthFactor &&
          !!pool.userHealthFactor &&
          !isEModeGroupEnabled &&
          isButtonEnabled &&
          hypotheticalUserHealthFactor !== undefined && (
            <HealthFactorUpdate
              className="sm:hidden"
              healthFactor={pool.userHealthFactor}
              hypotheticalHealthFactor={hypotheticalUserHealthFactor}
            />
          )}
      </div>

      {isBlockingPositionModalOpen && (
        <BlockingPositionModal
          onClose={closeBlockingPositionModal}
          blockingBorrowPositions={userBlockingBorrowPositions}
          eModeGroupName={eModeGroup.name}
        />
      )}
    </>
  );
};
