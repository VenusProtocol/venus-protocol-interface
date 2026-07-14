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
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const isMdOrUp = useBreakpointUp('md');

  const handleToggleDropdown = () => setIsTooltipOpen(!isTooltipOpen);

  return (
    <Provider>
      <TooltipPrimitive delayDuration={200} {...props}>
        <Trigger asChild>
          <div
            className={className}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();

              if (!isMdOrUp) {
                setIsTooltipOpen(true);
              }
            }}
          >
            {children}
          </div>
        </Trigger>
        <TooltipContent
          onPointerDownOutside={e => e.preventDefault()}
          className={cn('block p-3 z-99999 shadow', !isMdOrUp && 'hidden')}
        >
          {content}
          <Arrow className="fill-lightGrey w-[14px] h-[7px]" />
        </TooltipContent>
      </TooltipPrimitive>

      <Modal
        buttonClassName="right-3"
        onClick={e => e.stopPropagation()}
        isOpen={isTooltipOpen && !isMdOrUp}
        handleClose={handleToggleDropdown}
      >
        <div onClick={() => setIsTooltipOpen(false)}>{content}</div>
      </Modal>
    </Provider>
  );
};
