import { Icon } from 'components';
import { Dropdown } from 'components/Dropdown';
import { useTranslation } from 'libs/translations';
import { useChainId } from 'libs/wallet';
import type { VToken } from 'types';
import { cn, generateExplorerUrl } from 'utilities';

export interface GoToTokenContractProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onClick'> {
  vToken: VToken;
}

export const GoToTokenContractDropdown: React.FC<GoToTokenContractProps> = ({
  vToken,
  className,
}) => {
  const { t } = useTranslation();
  const { chainId } = useChainId();

  const options = [
    {
      label: (
        <a
          className="flex flex-row gap-2"
          href={generateExplorerUrl({ hash: vToken.underlyingToken.address, chainId })}
          target="_blank"
          rel="noreferrer"
        >
          <img
            className="w-5 max-w-none flex-none"
            src={vToken.underlyingToken.asset}
            alt={vToken.underlyingToken.symbol}
          />
          {t('interactive.goTo.contract', { symbol: vToken.underlyingToken.symbol })}
        </a>
      ),
      value: vToken.underlyingToken.symbol,
    },
    {
      label: (
        <a
          className="flex flex-row gap-2"
          href={generateExplorerUrl({ hash: vToken.address, chainId })}
          target="_blank"
          rel="noreferrer"
        >
          {vToken.asset && (
            <img className="w-5 max-w-none flex-none" src={vToken.asset} alt={vToken.symbol} />
          )}
          {t('interactive.goTo.contract', { symbol: vToken.symbol })}
        </a>
      ),
      value: vToken.symbol,
    },
  ];

  return (
    <Dropdown
      className={className}
      options={options}
      buttonClassName="flex justify-center items-center bg-background/40 p-1 h-8 w-8 border-none"
      menuTitle={t('interactive.goTo.modalTitle')}
    >
      {({ isDropdownOpened }) => (
        <Icon name="link" className={cn('h-6 w-6 border-none', isDropdownOpened && 'text-blue')} />
      )}
    </Dropdown>
  );
};
