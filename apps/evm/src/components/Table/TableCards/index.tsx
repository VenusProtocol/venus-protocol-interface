/** @jsxImportSource @emotion/react */
import { Spinner, cn } from '@venusprotocol/ui';
import { Link } from 'containers/Link';

import { Card, LabeledInlineContent } from 'components';
import { Delimiter } from '../../Delimiter';
import { useStyles } from '../styles';
import type { TableCardProps } from '../types';

export function TableCards<R>({
  cardClassName,
  data,
  isFetching,
  rowKeyExtractor,
  rowOnClick,
  getRowHref,
  breakpoint,
  columns,
  renderRowFooter,
  renderRowControl,
}: TableCardProps<R>) {
  const styles = useStyles();

  const [titleColumn, ...otherColumns] = columns;

  return (
    <div className={cn(!breakpoint && 'hidden', breakpoint && `block ${breakpoint}:hidden`)}>
      {isFetching && <Spinner css={styles.loader} />}

      <div className="space-y-6">
        {data.map((row, rowIndex) => {
          const rowKey = rowKeyExtractor(row);
          const content = (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>{titleColumn.renderCell(row, rowIndex)}</div>

                {renderRowControl ? renderRowControl(row, rowIndex) : undefined}
              </div>

              {renderRowFooter ? renderRowFooter(row, rowIndex) : undefined}

              <Delimiter />

              {otherColumns.map(column => (
                <LabeledInlineContent key={`${rowKey}-${column.key}`} label={column.label}>
                  <div className="text-right">{column.renderCell(row, rowIndex)}</div>
                </LabeledInlineContent>
              ))}
            </div>
          );

          return (
            <Card
              key={rowKey}
              className={cn(
                !!(rowOnClick || getRowHref) && 'cursor-pointer hover:bg-cards',
                cardClassName,
              )}
              onClick={rowOnClick && ((e: React.MouseEvent<HTMLDivElement>) => rowOnClick(e, row))}
              asChild
            >
              {getRowHref ? (
                <Link css={styles.link} to={getRowHref(row)}>
                  {content}
                </Link>
              ) : (
                <div>{content}</div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default TableCards;
