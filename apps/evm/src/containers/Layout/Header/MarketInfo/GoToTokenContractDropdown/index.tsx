import { Icon } from 'components';
import { Dropdown } from 'components/Dropdown';
import { useTranslation } from 'libs/translations';
import { useChainId } from 'libs/wallet';
import type { ChainId, Token, VToken } from 'types';
import { cn, generateExplorerUrl } from 'utilities';
import { TokenDropdownOption } from '../TokenDropdownOption';

export interface GoToTokenContractProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onClick'> {
  vToken: VToken;
}

const generateContractLink = (
  token: VToken | Token,
  chainId: ChainId,
  label: string,
  buttonSizeClasses?: string,
) => (
  <a
    className={cn(
      'flex flex-row justify-start items-center font-semibold gap-2 h-12 text-sm text-left px-4 py-3 whitespace-nowrap grow min-w-[180px]',
      buttonSizeClasses,
    )}
    href={generateExplorerUrl({ hash: token.address, chainId })}
    target="_blank"
    rel="noreferrer"
  >
    <TokenDropdownOption token={token} label={label} />
  </a>
);

export const GoToTokenContractDropdown: React.FC<GoToTokenContractProps> = ({
  vToken,
  className,
}) => {
  const { chainId } = useChainId();
  const { t } = useTranslation();

  const { underlyingToken } = vToken;

  const optionsDom = ({ buttonSizeClasses }: { buttonSizeClasses?: string }) => (
    <>
      {generateContractLink(
        underlyingToken,
        chainId,
        t('interactive.goTo.contract', { symbol: underlyingToken.symbol }),
        buttonSizeClasses,
      )}
      {generateContractLink(
        vToken,
        chainId,
        t('interactive.goTo.contract', { symbol: vToken.symbol }),
        buttonSizeClasses,
      )}
    </>
  );

  return (
    <Dropdown
      className={className}
      optionsDom={optionsDom}
      optionClassName="overflow-hidden"
      buttonClassName="flex justify-center items-center bg-background/40 p-1 h-8 w-8 border-none"
      menuTitle={t('interactive.goTo.modalTitle')}
    >
      {({ isDropdownOpened }) => (
        <Icon name="link" className={cn('h-5 w-5 border-none', isDropdownOpened && 'text-blue')} />
      )}
    </Dropdown>
  );
};
