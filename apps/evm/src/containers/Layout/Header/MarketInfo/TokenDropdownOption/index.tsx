import type { Token, VToken } from 'types';

interface TokenDropdownOptionProps {
  token: Token | VToken;
  label: string;
}

export const TokenDropdownOption = ({ token, label }: TokenDropdownOptionProps) => (
  <>
    <img className="w-5 max-w-none flex-none" src={token.asset} alt={token.symbol} />
    {label}
  </>
);
