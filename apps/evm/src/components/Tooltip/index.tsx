import {
  Arrow,
  Provider,
  Tooltip as TooltipPrimitive,
  type TooltipProps as TooltipPrimitiveProps,
  Trigger,
} from '@radix-ui/react-tooltip';
import { cn } from '@venusprotocol/ui';
import { Modal } from 'components/Modal';
import { useBreakpointUp } from 'hooks/responsive';
import { useState } from 'react';
import { TooltipContent } from './TooltipContent';

export interface TooltipProps extends TooltipPrimitiveProps {
  className?: string;
  content: string | React.ReactNode;
}

export const Tooltip = ({ className, content, children, ...props }: TooltipProps) => {
  const [isTooltipOpened, setIsTooltipOpened] = useState(false);
  const isMdOrUp = useBreakpointUp('md');

  const handleToggleDropdown = () => setIsTooltipOpened(!isTooltipOpened);

  return (
    <Provider>
      <TooltipPrimitive delayDuration={200} {...props}>
        <Trigger asChild>
          <div
            className={className}
            onClick={e => {
              if (!isMdOrUp) {
                setIsTooltipOpened(true);
              }
              e.preventDefault();
            }}
          >
            {children}
          </div>
        </Trigger>
        <TooltipContent
          onPointerDownOutside={e => e.preventDefault()}
          className={cn('block p-3 z-9999 shadow', !isMdOrUp && 'hidden')}
        >
          {content}
          <Arrow className="fill-lightGrey w-[14px] h-[7px]" />
        </TooltipContent>
      </TooltipPrimitive>

      <Modal
        buttonClassName="right-3"
        onClick={e => e.stopPropagation()}
        isOpen={isTooltipOpened && !isMdOrUp}
        handleClose={handleToggleDropdown}
      >
        <div>{content}</div>
      </Modal>
    </Provider>
  );
};
