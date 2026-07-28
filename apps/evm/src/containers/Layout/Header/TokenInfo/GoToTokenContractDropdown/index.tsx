import { cn } from '@venusprotocol/ui';
import { Dropdown, Icon } from 'components';
import { useTranslation } from 'libs/translations';
import { useChainId } from 'libs/wallet';
import type { Token, VToken, VhToken } from 'types';
import { DropdownToggleButton } from '../DropdownToggleButton';
import { TokenDropdownOption } from '../TokenDropdownOption';

export interface GoToTokenContractProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onClick'> {
  tokens: Array<Token | VToken | VhToken>;
}

export const GoToTokenContractDropdown: React.FC<GoToTokenContractProps> = ({
  tokens,
  className,
}) => {
  const { chainId } = useChainId();
  const { t } = useTranslation();

  const optionsDom = ({ setIsDropdownOpen }: { setIsDropdownOpen: (v: boolean) => void }) => (
    <>
      {tokens.map(token => (
        <TokenDropdownOption
          key={token.address}
          type="link"
          onClick={() => setIsDropdownOpen(false)}
          chainId={chainId}
          token={token}
          label={token.symbol}
        />
      ))}
    </>
  );

  return (
    <Dropdown
      className={className}
      optionsDom={optionsDom}
      menuTitle={t('interactive.goTo.modalTitle')}
    >
      {({ isDropdownOpen, handleToggleDropdown }) => (
        <DropdownToggleButton handleToggleDropdown={handleToggleDropdown}>
          <Icon name="link" className={cn('h-5 w-5 border-none', isDropdownOpen && 'text-blue')} />
        </DropdownToggleButton>
      )}
    </Dropdown>
  );
};
