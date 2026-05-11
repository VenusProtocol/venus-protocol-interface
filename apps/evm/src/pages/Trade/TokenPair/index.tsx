import { cn } from '@venusprotocol/ui';

import { ProtectionModeIndicator } from 'components';
import { useTranslation } from 'libs/translations';
import type { Token } from 'types';
import { TokenIcon, type TokenIconProps } from './TokenIcon';

export interface TokenPairProps {
  longToken: Token;
  shortToken: Token;
  size: TokenIconProps['size'];
  isLongProtected?: boolean;
  isShortProtected?: boolean;
  className?: string;
}

export const TokenPair: React.FC<TokenPairProps> = ({
  longToken,
  shortToken,
  className,
  size,
  isLongProtected,
  isShortProtected,
}) => {
  const { t } = useTranslation();
  const isBothProtected = isLongProtected && isShortProtected;

  const protectedTokenName = isBothProtected
    ? t('protectionModeIndicator.pairTokenNames', {
        longToken: longToken.symbol,
        shortToken: shortToken.symbol,
      })
    : isLongProtected
      ? longToken.symbol
      : shortToken.symbol;

  return (
    <div className={cn('flex items-center gap-x-2', className)}>
      <div className="flex items-center -space-x-2">
        <TokenIcon token={longToken} size={size} />
        <TokenIcon token={shortToken} size={size} />
      </div>

      <p className={cn(size === 'sm' ? 'text-b1s' : 'text-p3s')}>
        {longToken.symbol}/{shortToken.symbol}
      </p>

      {(isLongProtected || isShortProtected) && (
        <ProtectionModeIndicator
          variant="icon"
          tooltipType={isBothProtected ? 'pair' : 'list'}
          tokenName={protectedTokenName}
        />
      )}
    </div>
  );
};
