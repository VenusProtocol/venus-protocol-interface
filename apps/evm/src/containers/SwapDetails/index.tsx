import { cn } from '@venusprotocol/ui';
import { type ChangeEvent, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { ButtonGroup, Icon, LabeledInlineContent, Modal, TextField } from 'components';
import {
  DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE,
  HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
  HIGH_SLIPPAGE_PERCENTAGE,
} from 'constants/swap';
import { useGetUserSlippageTolerance } from 'hooks/useGetUserSlippageTolerance';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { useTranslation } from 'libs/translations';
import type { Token } from 'types';
import { formatPercentageToReadableValue } from 'utilities';
import { validateSlippageTolerancePercentage } from './validateSlippageTolerancePercentage';

export const slippageToleranceOptions = ['0.1', String(DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE), '1'];

interface FormValues {
  slippageTolerancePercentage: string;
}

export interface SwapDetailsProps extends React.HTMLAttributes<HTMLDivElement> {
  fromToken: Token;
  toToken: Token;
  priceImpactPercentage?: number;
}

export const SwapDetails: React.FC<SwapDetailsProps> = ({
  fromToken,
  toToken,
  priceImpactPercentage,
  ...otherProps
}) => {
  const { t } = useTranslation();

  const [userChainSettings, setUserChainSettings] = useUserChainSettings();
  const [isSlippageToleranceModalOpen, setIsSlippageToleranceModalOpen] = useState(false);

  const { control, handleSubmit, reset, setValue } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      slippageTolerancePercentage: userChainSettings.slippageTolerancePercentage,
    },
  });

  const slippageTolerancePercentage = useWatch({
    control,
    name: 'slippageTolerancePercentage',
  });

  const { userSlippageTolerancePercentage } = useGetUserSlippageTolerance();

  const readableUserSlippageTolerance = formatPercentageToReadableValue(
    userSlippageTolerancePercentage,
  );

  const readablePriceImpact = formatPercentageToReadableValue(priceImpactPercentage);

  const handleSlippageToleranceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setValue('slippageTolerancePercentage', value, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (validateSlippageTolerancePercentage(value)) {
      setUserChainSettings({
        slippageTolerancePercentage: Number.parseFloat(value).toString(),
      });
    }
  };

  const openSlippageToleranceModal = () => {
    reset({
      slippageTolerancePercentage: userChainSettings.slippageTolerancePercentage,
    });

    setIsSlippageToleranceModalOpen(true);
  };

  const closeSlippageToleranceModal = () => {
    setIsSlippageToleranceModalOpen(false);
  };

  const handleSlippageTolerancePresetClick = ({ value }: { value: string }) => {
    setValue('slippageTolerancePercentage', value, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setUserChainSettings({
      slippageTolerancePercentage: value,
    });

    closeSlippageToleranceModal();
  };

  return (
    <>
      <div className="flex items-center justify-between gap-x-2" {...otherProps}>
        <LabeledInlineContent
          label={t('swapDetails.slippageTolerance.label')}
          className="justify-start space-x-1 w-auto text-sm"
        >
          <div className="flex items-center justify-center gap-x-1">
            <p
              className={cn(
                userSlippageTolerancePercentage >= HIGH_SLIPPAGE_PERCENTAGE && 'text-red',
              )}
            >
              {readableUserSlippageTolerance}
            </p>

            <div className="flex items-center justify-center gap-x-1">
              <button type="button" onClick={openSlippageToleranceModal} className="cursor-pointer">
                <Icon name="gear" className="size-5" />
              </button>
            </div>
          </div>
        </LabeledInlineContent>

        <LabeledInlineContent
          label={t('swapDetails.priceImpact.label')}
          className="justify-start space-x-1 w-auto text-sm"
        >
          <span
            className={cn(
              'align-sub',
              priceImpactPercentage !== undefined &&
                priceImpactPercentage >= HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE &&
                'text-red',
            )}
          >
            {readablePriceImpact}
          </span>
        </LabeledInlineContent>
      </div>

      {isSlippageToleranceModalOpen && (
        <Modal
          isOpen
          handleClose={closeSlippageToleranceModal}
          title={t('swapDetails.slippageToleranceModal.title')}
        >
          <form className="space-y-6" onSubmit={handleSubmit(closeSlippageToleranceModal)}>
            <p className="text-grey">{t('swapDetails.slippageToleranceModal.description')}</p>

            <div className="flex items-center justify-between gap-x-4">
              <ButtonGroup
                buttonLabels={slippageToleranceOptions.map(formatPercentageToReadableValue)}
                activeButtonIndex={slippageToleranceOptions.findIndex(
                  value => Number(value) === Number(slippageTolerancePercentage),
                )}
                onButtonClick={index =>
                  handleSlippageTolerancePresetClick({
                    value: slippageToleranceOptions[index],
                  })
                }
                className="grow"
                buttonClassName="px-0 max-w-90"
              />

              <Controller
                name="slippageTolerancePercentage"
                control={control}
                rules={{
                  validate: value => !value || validateSlippageTolerancePercentage(value),
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    placeholder={String(DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE)}
                    step={0.01}
                    type="number"
                    className="w-25 shrink-0"
                    inputContainerClassName="h-12"
                    hasError={!!field.value && fieldState.invalid}
                    autoFocus
                    onChange={handleSlippageToleranceChange}
                  />
                )}
              />
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};
