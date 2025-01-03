import type { ChainId, Token, VToken } from 'types';
import { cn, generateExplorerUrl } from 'utilities';

type ConditionalTokenDropdownOptionProps =
  | {
      onClick: () => void;
      chainId?: never;
      type: 'button';
    }
  | {
      onClick?: never;
      chainId: ChainId;
      type: 'link';
    };

type TokenDropdownOptionProps = {
  buttonClassName?: string;
  className?: string;
  token: Token | VToken;
  label: string;
} & ConditionalTokenDropdownOptionProps;

export const TokenDropdownOption = ({
  chainId,
  className,
  onClick,
  token,
  label,
  type,
}: TokenDropdownOptionProps) => {
  const wrapperClassName = cn(
    'flex items-center justify-start py-3 px-4 text-left text-sm font-semibold flex-row gap-2 grow min-w-[180px] cursor-pointer hover:bg-lightGrey active:bg-lightGrey',
    className,
  );
  const contentsDom = (
    <>
      <img className="w-5 max-w-none flex-none" src={token.asset} alt={token.symbol} />
      {label}
    </>
  );
  const dom =
    type === 'button' ? (
      <span onClick={onClick} className={wrapperClassName}>
        {contentsDom}
      </span>
    ) : (
      <a
        className={wrapperClassName}
        href={generateExplorerUrl({ hash: token.address, chainId })}
        target="_blank"
        rel="noreferrer"
      >
        {contentsDom}
      </a>
    );

  return dom;
};
