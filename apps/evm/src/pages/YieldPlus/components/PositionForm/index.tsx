import { PrimaryButton, cn } from '@venusprotocol/ui';
import {
  HealthFactorPill,
  LabeledProgressBar,
  Select,
  Slider,
  TokenIconWithSymbol,
} from 'components';
import { useTranslation } from 'libs/translations';
import { useMemo, useState } from 'react';
import type { Token } from 'types';

import { SlippageSettings } from '../SlippageSettings';

export interface PositionFormProps {
  side: 'long' | 'short';
  longToken: Token;
  shortToken: Token;
  className?: string;
}

// Mock computed stats – replaced by real hook data when API layer is wired
const MOCK_LIQ_PRICE = '0';
const MOCK_AVG_ENTER_PRICE = '0';
const MOCK_NET_APY = '0';
const MOCK_LTV_VALUE = 37.53;
const MOCK_LT_VALUE = 12.52;
const MOCK_HEALTH_FACTOR = 3.4;
const MOCK_AVAILABLE_BALANCE = '0';
const MOCK_SHORT_AVAILABLE = '0';
const MOCK_COLLATERAL_SYMBOL = 'USDT';

export const PositionForm: React.FC<PositionFormProps> = ({
  side,
  longToken,
  shortToken,
  className,
}) => {
  const { t } = useTranslation();

  const [collateralSymbol, setCollateralSymbol] = useState<string>(MOCK_COLLATERAL_SYMBOL);
  const [collateralAmount, setCollateralAmount] = useState<string>('');
  const [leverage, setLeverage] = useState<number>(0);

  // Collateral options – in production resolved from a useGetYieldPlusPairs hook
  const collateralOptions = useMemo(
    () => [
      { value: 'USDT', label: 'USDT' },
      { value: 'USDC', label: 'USDC' },
    ],
    [],
  );

  // Derived leverage multiplier label e.g. "2.0x"
  const leverageLabel = useMemo(() => {
    const multiplier = 1 + leverage / 100;
    return t('yieldPlus.form.leverage', { value: multiplier.toFixed(1) });
  }, [leverage, t]);

  // The "active" token for the selected side
  const activeSideToken = side === 'long' ? longToken : shortToken;

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* ── Collateral section ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-b2r text-grey">{t('yieldPlus.form.collateral')}</span>
          <span className="text-b2r text-grey">≈$0 &nbsp; 2x</span>
        </div>

        {/* Collateral token selector + amount input */}
        <div className="flex items-stretch gap-2">
          <div className="w-[120px] shrink-0">
            <Select
              value={collateralSymbol}
              onChange={newValue => setCollateralSymbol(String(newValue))}
              options={collateralOptions}
              size="medium"
              variant="primary"
            />
          </div>

          <input
            type="number"
            value={collateralAmount}
            onChange={e => setCollateralAmount(e.target.value)}
            placeholder="0"
            min={0}
            className={cn(
              'flex-1 h-12 bg-dark-blue border border-dark-blue-disabled/50 rounded-lg px-4',
              'text-b1s text-white text-right placeholder:text-grey',
              'focus:outline-none focus:border-blue hover:border-blue/50',
              'transition-colors',
            )}
          />
        </div>

        {/* Available collateral balance */}
        <div className="flex items-center justify-end">
          <span className="text-b2r text-grey">
            {t('yieldPlus.form.available')} {MOCK_AVAILABLE_BALANCE} {collateralSymbol}
          </span>
        </div>
      </div>

      {/* ── Long token row ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-b2r text-grey">{t('yieldPlus.form.long')}</span>
          <span className="text-b2r text-grey">≈$0</span>
        </div>
        <div className="flex items-center justify-between bg-dark-blue border border-dark-blue-disabled/50 rounded-lg px-4 h-12">
          <TokenIconWithSymbol token={longToken} />
          <span className="text-b1s text-white">0</span>
        </div>
      </div>

      {/* ── Short token row ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <span className="text-b2r text-grey">{t('yieldPlus.form.short')}</span>
        <div className="flex items-center justify-between bg-dark-blue border border-dark-blue-disabled/50 rounded-lg px-4 h-12">
          <TokenIconWithSymbol token={shortToken} />
          <span className="text-b1s text-white">0</span>
        </div>
        <div className="flex items-center justify-end">
          <span className="text-b2r text-grey">
            {t('yieldPlus.form.available')} {MOCK_SHORT_AVAILABLE} {activeSideToken.symbol}
          </span>
        </div>
      </div>

      {/* ── Leverage slider ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <Slider value={leverage} onChange={setLeverage} min={0} max={100} step={1} />
        <div className="flex items-center justify-between">
          <span className="text-b2r text-grey">0%</span>
          <span className="text-b2r text-white">{leverageLabel}</span>
          <span className="text-b2r text-grey">100%</span>
        </div>
      </div>

      {/* ── Stats rows ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 border-t border-dark-blue-hover pt-4">
        <div className="flex items-center justify-between">
          <span className="text-b1r text-grey">{t('yieldPlus.form.liqPrice')}</span>
          <span className="text-b1s text-white">{MOCK_LIQ_PRICE}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-b1r text-grey">{t('yieldPlus.form.avgEnterPrice')}</span>
          <span className="text-b1s text-white">{MOCK_AVG_ENTER_PRICE}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-b1r text-grey">{t('yieldPlus.form.netApy')}</span>
          <span className="text-b1s text-green">{MOCK_NET_APY}</span>
        </div>
      </div>

      {/* ── LTV progress bar ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-b2r text-grey">
            {t('yieldPlus.form.ltv', { value: `${MOCK_LTV_VALUE}%` })}
          </span>
          <span className="text-b2r text-grey">
            {t('yieldPlus.form.lt', { value: `${MOCK_LT_VALUE}%` })}
          </span>
        </div>
        <LabeledProgressBar
          value={MOCK_LTV_VALUE}
          mark={MOCK_LT_VALUE}
          step={1}
          ariaLabel={t('yieldPlus.form.ltv', { value: `${MOCK_LTV_VALUE}%` })}
          min={0}
          max={100}
        />
      </div>

      {/* ── Health factor ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <span className="text-b1r text-grey">{t('yieldPlus.form.healthFactor')}</span>
        <HealthFactorPill factor={MOCK_HEALTH_FACTOR} showLabel />
      </div>

      {/* ── Open button ────────────────────────────────────────────────── */}
      <PrimaryButton
        className="w-full h-12"
        disabled={!collateralAmount || Number(collateralAmount) <= 0}
      >
        {t('yieldPlus.form.open')}
      </PrimaryButton>

      {/* ── Slippage settings ──────────────────────────────────────────── */}
      <SlippageSettings />
    </div>
  );
};
