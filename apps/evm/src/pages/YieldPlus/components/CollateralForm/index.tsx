import { PrimaryButton, cn } from '@venusprotocol/ui';
import { TokenIconWithSymbol } from 'components';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import type { Token } from 'types';

export interface CollateralFormProps {
  collateralToken: Token;
  className?: string;
}

type CollateralAction = 'deposit' | 'withdraw';

export const CollateralForm: React.FC<CollateralFormProps> = ({ collateralToken, className }) => {
  const { t } = useTranslation();
  const [action, setAction] = useState<CollateralAction>('deposit');
  const [amount, setAmount] = useState('');

  const availableBalance = '0';

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Action toggle */}
      <div className="flex items-center gap-2 border-b border-dark-blue-hover pb-4">
        <button
          type="button"
          onClick={() => setAction('deposit')}
          className={cn(
            'text-b1s px-3 py-1 rounded-full transition-colors',
            action === 'deposit' ? 'bg-blue text-background' : 'text-grey hover:text-white',
          )}
        >
          {t('yieldPlus.collateralForm.deposit')}
        </button>
        <button
          type="button"
          onClick={() => setAction('withdraw')}
          className={cn(
            'text-b1s px-3 py-1 rounded-full transition-colors',
            action === 'withdraw' ? 'bg-blue text-background' : 'text-grey hover:text-white',
          )}
        >
          {t('yieldPlus.collateralForm.withdraw')}
        </button>
      </div>

      {/* Collateral token display */}
      <div className="flex flex-col gap-2">
        <span className="text-b2r text-grey">{t('yieldPlus.form.collateral')}</span>
        <div className="flex items-center justify-between bg-dark-blue border border-dark-blue-disabled/50 rounded-lg px-4 h-12">
          <TokenIconWithSymbol token={collateralToken} />
          <span className="text-b1s text-grey">{availableBalance}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-b2r text-grey">{t('yieldPlus.form.available')}</span>
          <span className="text-b2r text-white">
            {availableBalance} {collateralToken.symbol}
          </span>
        </div>
      </div>

      {/* Amount input */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0"
            min={0}
            className={cn(
              'w-full bg-dark-blue border border-dark-blue-disabled/50 rounded-lg px-4 h-12',
              'text-b1s text-white placeholder:text-grey',
              'focus:outline-none focus:border-blue hover:border-blue/50',
              'transition-colors',
            )}
          />
          <button
            type="button"
            onClick={() => setAmount(availableBalance)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-b2s text-blue hover:text-blue/80 transition-colors"
          >
            {t('yieldPlus.collateralForm.max')}
          </button>
        </div>
      </div>

      {/* Submit button */}
      <PrimaryButton className="w-full h-12" disabled={!amount || Number(amount) <= 0}>
        {action === 'deposit'
          ? t('yieldPlus.collateralForm.deposit')
          : t('yieldPlus.collateralForm.withdraw')}{' '}
        {collateralToken.symbol}
      </PrimaryButton>
    </div>
  );
};
