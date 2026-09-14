import { ImgGroupTooltip, type TableColumn } from 'components';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { useTranslation } from 'libs/translations';
import type { LiquidityHubSourceRating } from 'types';

export interface RatingGroupProps {
  ratings: LiquidityHubSourceRating[];
  className?: string;
}

export const RatingGroup: React.FC<RatingGroupProps> = ({ ratings, className }) => {
  const { t } = useTranslation();

  if (ratings.length === 0) {
    return <span>{PLACEHOLDER_KEY}</span>;
  }

  const columns: TableColumn<LiquidityHubSourceRating>[] = [
    {
      key: 'agency',
      label: t('liquidityHub.allocationDetails.yieldGroup.ratingColumn.group.agency'),
      selectOptionLabel: t('liquidityHub.allocationDetails.yieldGroup.ratingColumn.group.agency'),
      renderCell: rating => (
        <div className="flex min-w-0 items-center gap-x-2">
          <img alt={rating.agencyName} className="size-5 shrink-0" src={rating.agencyIconSrc} />

          <span className="truncate">{rating.agencyName}</span>
        </div>
      ),
    },
    {
      key: 'rating',
      label: t('liquidityHub.allocationDetails.yieldGroup.ratingColumn.group.rating'),
      selectOptionLabel: t('liquidityHub.allocationDetails.yieldGroup.ratingColumn.group.rating'),
      align: 'right',
      renderCell: rating => rating.value ?? PLACEHOLDER_KEY,
    },
  ];

  const hasReportUrl = ratings.some(rating => !!rating.reportUrl);

  const handleRowClick = (
    _event: React.MouseEvent<HTMLDivElement>,
    row: LiquidityHubSourceRating,
  ) => {
    if (!row.reportUrl) {
      return;
    }

    window.open(row.reportUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <ImgGroupTooltip
      imgs={ratings.map(rating => ({ src: rating.agencyIconSrc, alt: rating.agencyName }))}
      data={ratings}
      rowKeyExtractor={row => row.agencyName}
      columns={columns}
      rowOnClick={hasReportUrl ? handleRowClick : undefined}
      getRowClassName={row => (row.reportUrl ? undefined : 'cursor-default hover:bg-transparent')}
      tableLayout="auto"
      className={className}
      contentClassName="max-w-none"
    />
  );
};
