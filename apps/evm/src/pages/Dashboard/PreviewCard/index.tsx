import type { ChainId } from '@venusprotocol/chains';
import { cn } from '@venusprotocol/ui';
import { Card, Cell, type CellProps } from 'components';
import { Link } from 'containers/Link';
import type { ReactNode } from 'react';
import type { To } from 'react-router';

interface PreviewCardBaseProps {
  header: ReactNode;
  status?: ReactNode;
  cells: CellProps[];
  className?: string;
}

type PreviewCardActionProps =
  | {
      onClick?: () => void;
      to?: undefined;
      chainId?: undefined;
    }
  | {
      onClick?: undefined;
      to: To;
      chainId?: ChainId;
    };

export type PreviewCardProps = PreviewCardBaseProps & PreviewCardActionProps;

export const PreviewCard: React.FC<PreviewCardProps> = ({
  header,
  status,
  cells,
  onClick,
  to,
  chainId,
  className,
}) => {
  let content = (
    <>
      <div className="flex items-start justify-between gap-2">
        {header}

        {status}
      </div>

      <div className="flex gap-2">
        {cells.map((cell, index) => (
          <Cell
            key={index}
            {...cell}
            className={cn(
              'flex-1 min-w-0',
              index === cells.length - 1 && 'text-right items-end',
              cell.className,
            )}
          />
        ))}
      </div>
    </>
  );

  if (to) {
    content = (
      <Link noStyle to={to} chainId={chainId}>
        {content}
      </Link>
    );
  }

  return (
    <Card
      asChild={!!to}
      className={cn(
        'w-full h-full flex flex-col p-6 gap-3 duration-200',
        (onClick || to) && 'cursor-pointer hover:border-blue',
        className,
      )}
      onClick={onClick}
    >
      {content}
    </Card>
  );
};
