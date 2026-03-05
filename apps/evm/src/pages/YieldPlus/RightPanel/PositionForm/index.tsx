import { Button, cn } from '@venusprotocol/ui';
import { Icon } from 'components/Icon';
import { TokenIcon } from 'components/TokenIcon';
import { TokenListWrapper } from 'components/TokenListWrapper';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import type { Token } from 'types';

import { HealthFactorBadge } from './HealthFactorBadge';
import { LtvBar } from './LtvBar';

export interface PositionFormProps {
  longToken: Token;
  shortToken: Token;
  availableCollateralTokens: Token[];
  className?: string;
}

const LIQUIDATION_THRESHOLD_PERCENTAGE = 80;
const DEFAULT_MULTIPLIER = 2;
const DEFAULT_HEALTH_FACTOR = 3.4;

interface CollateralInputProps {
  token: Token;
  availableTokens: Token[];
  value: string;
  onChange: (v: string) => void;
  onTokenChange: (t: Token) => void;
}

const CollateralInput: React.FC<CollateralInputProps> = ({
  token,
  availableTokens,
  value,
  onChange,
  onTokenChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TokenListWrapper
      tokenBalances={availableTokens.map(t => ({ token: t }))}
      onTokenClick={t => {
        onTokenChange(t);
        setIsOpen(false);
      }}
      onClose={() => setIsOpen(false)}
      isListShown={isOpen}
      selectedToken={token}
      displayCommonTokenButtons={false}
    >
      <div className="flex items-center rounded-xl bg-background border border-lightGrey overflow-hidden">
        <button
          type="button"
          onClick={() => setIsOpen(o => !o)}
          className="flex items-center gap-2 px-3 py-3 hover:bg-lightGrey transition-colors shrink-0"
        >
          <TokenIcon token={token} className="size-5" />
          <span className="text-b1s text-white">{token.symbol}</span>
          <Icon name="chevronDown" className="size-3 text-grey" />
        </button>

        <div className="w-px h-8 bg-lightGrey" />

        <input
          type="number"
          min={0}
          value={value}
          onChange={e => onChange(e.currentTarget.value)}
          placeholder="0"
          className="flex-1 bg-transparent px-3 py-3 text-b1s text-white text-right outline-none placeholder:text-grey"
        />
      </div>
    </TokenListWrapper>
  );
};

interface TokenRowProps {
  token: Token;
  value: string;
  label?: string;
}

const TokenRow: React.FC<TokenRowProps> = ({ token, value, label }) => (
  <div className="flex items-center gap-3 rounded-xl bg-background border border-lightGrey px-3 py-3">
    <TokenIcon token={token} className="size-6 shrink-0" />
    <span className="text-b1s text-white flex-1">{label ?? token.symbol}</span>
    <span className="text-b1s text-white">{value}</span>
  </div>
);

export const PositionForm: React.FC<PositionFormProps> = ({
  longToken,
  shortToken,
  availableCollateralTokens,
  className,
}) => {
  const { t } = useTranslation();

  const [collateralToken, setCollateralToken] = useState<Token>(
    () => availableCollateralTokens.find(t => t.symbol === 'USDT') ?? availableCollateralTokens[0],
  );
  const [collateralAmount, setCollateralAmount] = useState('');
  const [ltvPercentage, setLtvPercentage] = useState(0);

  const healthFactor = DEFAULT_HEALTH_FACTOR - (ltvPercentage / 100) * 2;

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex flex-col gap-4">
        {/* Collateral section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-b1r text-grey">
              {t('yieldPlus.positionForm.collateral.label')}
            </span>
            <span className="text-b2r text-grey px-2 py-0.5 rounded-md bg-background border border-lightGrey">
              {t('yieldPlus.positionForm.collateral.multiplier', { value: DEFAULT_MULTIPLIER })}
            </span>
          </div>

          <CollateralInput
            token={collateralToken}
            availableTokens={availableCollateralTokens}
            value={collateralAmount}
            onChange={setCollateralAmount}
            onTokenChange={setCollateralToken}
          />

          <div className="flex items-center justify-between px-1">
            <span className="text-b2r text-grey">{t('yieldPlus.positionForm.available')}</span>
            <span className="text-b2r text-white">0 {collateralToken.symbol}</span>
          </div>
        </div>

        {/* Long row */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between px-1">
            <span className="text-b1r text-grey">{t('yieldPlus.positionForm.long.label')}</span>
            <span className="text-b2r text-grey">≈$0</span>
          </div>
          <TokenRow token={longToken} value="0" />
        </div>

        {/* Short row */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between px-1">
            <span className="text-b1r text-grey">{t('yieldPlus.positionForm.short.label')}</span>
            <span className="text-b2r text-grey">≈$0</span>
          </div>
          <TokenRow token={shortToken} value="0" />
          <div className="flex items-center justify-between px-1">
            <span className="text-b2r text-grey">{t('yieldPlus.positionForm.available')}</span>
            <span className="text-b2r text-white">0 {shortToken.symbol}</span>
          </div>
        </div>

        {/* Slider */}
        <div className="flex flex-col gap-1">
          <input
            type="range"
            min={0}
            max={100}
            value={ltvPercentage}
            onChange={e => setLtvPercentage(Number(e.currentTarget.value))}
            className="w-full accent-blue-400"
          />
          <div className="flex items-center justify-between px-0.5">
            <span className="text-b2r text-grey">0%</span>
            <span className="text-b2r text-grey">100%</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-2">
          {[
            {
              label: t('yieldPlus.positionForm.long.label'),
              value: '0',
              icon: longToken,
            },
            {
              label: t('yieldPlus.positionForm.short.label'),
              value: '0',
              icon: shortToken,
            },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TokenIcon token={row.icon} className="size-4" />
                <span className="text-b1r text-grey">{row.label}</span>
              </div>
              <span className="text-b1r text-white">{row.value}</span>
            </div>
          ))}

          <div className="flex items-center justify-between">
            <span className="text-b1r text-grey">
              {t('yieldPlus.positionForm.liquidationPrice')}
            </span>
            <span className="text-b1r text-white">0</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-b1r text-grey">{t('yieldPlus.positionForm.avgEnterPrice')}</span>
            <span className="text-b1r text-white">0</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-b1r text-grey">{t('yieldPlus.positionForm.netApy')}</span>
            <span className="text-b1r text-white">0</span>
          </div>
        </div>

        {/* LTV bar */}
        <LtvBar
          ltvPercentage={ltvPercentage}
          liquidationThresholdPercentage={LIQUIDATION_THRESHOLD_PERCENTAGE}
          onChange={setLtvPercentage}
        />

        {/* Health factor */}
        <HealthFactorBadge value={healthFactor} />

        {/* Open button */}
        <Button variant="primary" className="w-full" disabled={false}>
          {t('yieldPlus.positionForm.button.open')}
        </Button>

        {/* Footer */}
        <div className="flex items-center justify-between text-b2r text-grey">
          <span className="flex items-center gap-1">
            {t('yieldPlus.positionForm.slippageTolerance', { value: '0.5%' })}
            <Icon name="gear" className="size-3" />
          </span>
          <span>{t('yieldPlus.positionForm.priceImpact')} -</span>
        </div>
      </div>
    </div>
  );
};
