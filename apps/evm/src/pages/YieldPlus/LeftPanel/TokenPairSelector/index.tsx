import { cn } from '@venusprotocol/ui';
import { Icon } from 'components/Icon';
import { TokenIcon } from 'components/TokenIcon';
import { TokenListWrapper } from 'components/TokenListWrapper';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import type { Token } from 'types';

export interface TokenPairSelectorProps {
  longToken: Token;
  shortToken: Token;
  availableTokens: Token[];
  onLongTokenChange: (token: Token) => void;
  onShortTokenChange: (token: Token) => void;
  onDropdownOpenChange?: (isOpen: boolean) => void;
  className?: string;
}

interface TokenPillProps {
  label: string;
  token: Token;
  availableTokens: Token[];
  onChange: (token: Token) => void;
  variant: 'long' | 'short';
  onOpenChange?: (isOpen: boolean) => void;
}

const TokenPill: React.FC<TokenPillProps> = ({
  label,
  token,
  availableTokens,
  onChange,
  variant,
  onOpenChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const setOpen = (v: boolean) => {
    setIsOpen(v);
    onOpenChange?.(v);
  };

  const tokenBalances = availableTokens.map(t => ({ token: t }));

  const handleSelect = (selected: Token) => {
    onChange(selected);
    setOpen(false);
  };

  const badgeBg = variant === 'long' ? 'bg-green' : 'bg-red';

  return (
    <div className="flex-1 min-w-0">
      <TokenListWrapper
        tokenBalances={tokenBalances}
        onTokenClick={handleSelect}
        onClose={() => setOpen(false)}
        isListShown={isOpen}
        selectedToken={token}
        displayCommonTokenButtons={false}
      >
        <button
          type="button"
          onClick={() => setOpen(!isOpen)}
          className="flex w-full items-center gap-2 rounded-xl bg-cards border border-lightGrey px-3 py-3 hover:border-blue transition-colors"
        >
          {/* Colored label badge */}
          <span className={cn('shrink-0 rounded-lg px-2 py-0.5 text-b2s text-white', badgeBg)}>
            {label}
          </span>

          {/* Token icon + symbol */}
          <TokenIcon token={token} className="size-5 shrink-0" />
          <span className="text-b1s text-white flex-1 text-left truncate">{token.symbol}</span>

          <Icon name="chevronDown" className="size-4 text-grey shrink-0" />
        </button>
      </TokenListWrapper>
    </div>
  );
};

export const TokenPairSelector: React.FC<TokenPairSelectorProps> = ({
  longToken,
  shortToken,
  availableTokens,
  onLongTokenChange,
  onShortTokenChange,
  onDropdownOpenChange,
  className,
}) => {
  const { t } = useTranslation();

  const handleOpenChange = (isOpen: boolean) => {
    onDropdownOpenChange?.(isOpen);
  };

  return (
    <div className={cn('relative z-50 flex gap-3', className)}>
      <TokenPill
        label={t('yieldPlus.tokenPairSelector.long')}
        token={longToken}
        availableTokens={availableTokens}
        onChange={onLongTokenChange}
        variant="long"
        onOpenChange={handleOpenChange}
      />

      <TokenPill
        label={t('yieldPlus.tokenPairSelector.short')}
        token={shortToken}
        availableTokens={availableTokens}
        onChange={onShortTokenChange}
        variant="short"
        onOpenChange={handleOpenChange}
      />
    </div>
  );
};
