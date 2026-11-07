import {
  Arrow,
  Provider,
  Tooltip as TooltipPrimitive,
  type TooltipProps as TooltipPrimitiveProps,
  Trigger,
} from '@radix-ui/react-tooltip';
import { cn } from '@venusprotocol/ui';
import { Modal } from 'components/Modal';
import { useHasHoverPointer } from 'hooks/responsive';
import { useState } from 'react';
import { TooltipContent } from './TooltipContent';

export interface TooltipProps extends TooltipPrimitiveProps {
  className?: string;
  contentClassName?: string;
  content: string | React.ReactNode;
}

export const Tooltip = ({
  className,
  content,
  children,
  contentClassName,
  ...props
}: TooltipProps) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const hasHoverPointer = useHasHoverPointer();

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

              if (!hasHoverPointer) {
                setIsTooltipOpen(true);
              }
            }}
          >
            {children}
          </div>
        </Trigger>

        <TooltipContent
          onPointerDownOutside={e => e.preventDefault()}
          className={cn(
            'block overflow-visible p-3 z-99999',
            !hasHoverPointer && 'hidden',
            contentClassName,
          )}
        >
          {content}

          <Arrow asChild>
            <svg
              className="-mt-px h-[7px] w-[14px] overflow-visible bg-surface-tooltip backdrop-blur-raised backdrop-saturate-[1.2] [clip-path:polygon(0_0,100%_0,50%_100%)]"
              aria-hidden
            >
              <path
                d="M0 0L15 10L30 0"
                className="fill-none stroke-border-raised stroke-2"
                strokeLinejoin="round"
              />
            </svg>
          </Arrow>
        </TooltipContent>
      </TooltipPrimitive>

      <Modal
        buttonClassName="right-3"
        onClick={e => e.stopPropagation()}
        isOpen={isTooltipOpen && !hasHoverPointer}
        handleClose={handleToggleDropdown}
      >
        <div onClick={() => setIsTooltipOpen(false)}>{content}</div>
      </Modal>
    </Provider>
  );
};
