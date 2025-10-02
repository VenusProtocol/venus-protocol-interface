import { chains } from '@venusprotocol/chains';
import { useState } from 'react';

import { cn } from '@venusprotocol/ui';
import { Icon } from 'components';
import type { ChainId, ProposalAction } from 'types';
import TEST_IDS from '../../testIds';
import { ActionsAccordion } from './ActionsAccordion';

export interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {
  chainId: ChainId;
  proposalActions: ProposalAction[];
  description?: React.ReactElement;
  contentRightItem?: React.ReactElement;
  contentBottomItem?: React.ReactElement;
}

export const Command: React.FC<CommandProps> = ({
  chainId,
  proposalActions,
  description,
  contentRightItem,
  contentBottomItem,
  ...otherProps
}) => {
  const chain = chains[chainId];
  const [isOpen, setIsOpen] = useState(false);
  const toggleAccordion = () => setIsOpen(prevState => !prevState);

  return (
    <div data-testid={TEST_IDS.command} {...otherProps}>
      <div className={cn('flex justify-between sm:flex sm:justify-between')}>
        <div className={cn('flex-1', !description && 'flex flex-col justify-center')}>
          <div className="cursor-pointer pr-3 space-y-3 md:space-y-1" onClick={toggleAccordion}>
            <div className="flex items-center gap-x-2">
              <img src={chain.iconSrc} alt={chain.name} className="w-5 max-w-none flex-none" />

              <div className="flex items-center">
                <p className="text-sm font-semibold">{chain.name}</p>

                <Icon
                  name="arrowUp"
                  className={cn('text-grey w-5 h-5 ml-1', !isOpen && 'rotate-180')}
                />
              </div>
            </div>

            {description}
          </div>

          <ActionsAccordion
            className="hidden lg:block"
            isOpen={isOpen}
            chainId={chainId}
            proposalActions={proposalActions}
          />
        </div>

        {contentRightItem}
      </div>

      <ActionsAccordion
        className="lg:hidden"
        isOpen={isOpen}
        chainId={chainId}
        proposalActions={proposalActions}
      />

      {contentBottomItem}
    </div>
  );
};
