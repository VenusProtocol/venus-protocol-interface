import { cn } from '@venusprotocol/ui';

import { Button, Icon, InfoIcon } from 'components';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import type { EModeGroup, Pool } from 'types';
import { calculateHealthFactor } from 'utilities';
import { BlockingPositionModal } from './BlockingPositionModal';
import { HealthFactorUpdate } from './HealthFactorUpdate';

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

  // TODO: wire up
  const enableEModeGroup = () => {};

  // TODO: calculate
  const hypotheticalPoolUserHealthFactor = 8.4;

  const poolUserHealthFactor =
    pool.userLiquidationThresholdCents &&
    pool.userBorrowBalanceCents &&
    calculateHealthFactor({
      liquidationThresholdCents: pool.userLiquidationThresholdCents.toNumber(),
      borrowBalanceCents: pool.userBorrowBalanceCents.toNumber(),
    });

  const isEModeGroupEnabled = pool.userEModeGroup && pool.userEModeGroup.id === eModeGroup.id;

  // TODO: check user may enable group
  const isUserEligible = true;
  // TODO: pass actual blocking assets
  const blockingAssets = pool.assets.slice(0, 3);

  let buttonLabel = t('pool.eMode.group.enableButtonLabel');

  if (isEModeGroupEnabled) {
    buttonLabel = t('pool.eMode.group.enabledButtonLabel');
  } else if (pool.userEModeGroup && !isEModeGroupEnabled && isUserEligible) {
    buttonLabel = t('pool.eMode.group.switchButtonLabel');
  }

  return (
    <>
      <div className={cn('space-y-3', className)}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold lg:text-lg">{eModeGroup.name}</h3>

          <div className="flex items-center gap-x-4">
            {poolUserHealthFactor && !isEModeGroupEnabled && isUserEligible && (
              <HealthFactorUpdate
                className="hidden sm:flex"
                healthFactor={poolUserHealthFactor}
                hypotheticalHealthFactor={hypotheticalPoolUserHealthFactor}
              />
            )}

            <Button
              onClick={enableEModeGroup}
              small
              disabled={isEModeGroupEnabled || !isUserEligible}
              className={cn(isEModeGroupEnabled && isUserEligible && 'disabled:text-offWhite')}
            >
              {isEModeGroupEnabled && <Icon name="mark" className="text-green mr-2" />}

              {!isEModeGroupEnabled && !isUserEligible && (
                <InfoIcon
                  className="mr-2"
                  tooltip={
                    <Trans
                      i18nKey="pool.eMode.group.cannotEnable.tooltip"
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
                  }
                />
              )}

              <span className={cn(!isEModeGroupEnabled && !isUserEligible && 'opacity-50')}>
                {buttonLabel}
              </span>
            </Button>
          </div>
        </div>

        {poolUserHealthFactor && !isEModeGroupEnabled && isUserEligible && (
          <HealthFactorUpdate
            className="sm:hidden"
            healthFactor={poolUserHealthFactor}
            hypotheticalHealthFactor={hypotheticalPoolUserHealthFactor}
          />
        )}
      </div>

      {isBlockingPositionModalOpen && (
        <BlockingPositionModal
          onClose={closeBlockingPositionModal}
          blockingAssets={blockingAssets}
          eModeGroupName={eModeGroup.name}
          poolComptrollerAddress={pool.comptrollerAddress}
        />
      )}
    </>
  );
};
