import { Dropdown, Icon } from 'components';
import { useTranslation } from 'libs/translations';
import { useChainId } from 'libs/wallet';
import type { VToken } from 'types';
import { cn } from 'utilities';
import { DropdownToggleButton } from '../DropdownToggleButton';
import { TokenDropdownOption } from '../TokenDropdownOption';

export interface GoToTokenContractProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onClick'> {
  vToken: VToken;
}

export const GoToTokenContractDropdown: React.FC<GoToTokenContractProps> = ({
  vToken,
  className,
}) => {
  const { chainId } = useChainId();
  const { t } = useTranslation();

  const { underlyingToken } = vToken;

  const optionsDom = () => (
    <>
      <TokenDropdownOption
        type="link"
        chainId={chainId}
        token={underlyingToken}
        label={underlyingToken.symbol}
      />
      <TokenDropdownOption type="link" chainId={chainId} token={vToken} label={vToken.symbol} />
    </>
  );

  return (
    <Dropdown
      className={className}
      optionsDom={optionsDom}
      optionClassName="overflow-hidden flex bg-background/40 border-none"
      menuTitle={t('interactive.goTo.modalTitle')}
    >
      {({ isDropdownOpened, handleToggleDropdown }) => (
        <DropdownToggleButton handleToggleDropdown={handleToggleDropdown}>
          <Icon
            name="link"
            className={cn('h-5 w-5 border-none', isDropdownOpened && 'text-blue')}
          />
        </DropdownToggleButton>
      )}
    </Dropdown>
  );
};