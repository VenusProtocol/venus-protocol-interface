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

  // A fund with no agency coverage gets the placeholder and no trigger, so the popover is never
  // opened empty
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

          {/* Agency names come from the API and are never translated */}
          <span className="truncate">{rating.agencyName}</span>
        </div>
      ),
    },
    {
      key: 'rating',
      label: t('liquidityHub.allocationDetails.yieldGroup.ratingColumn.group.rating'),
      selectOptionLabel: t('liquidityHub.allocationDetails.yieldGroup.ratingColumn.group.rating'),
      align: 'right',
      // Rendered verbatim: agency notation is opaque and must not be parsed or reformatted. An
      // agency we know about but whose rating is unavailable still gets its row
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
      imgSrcs={ratings.map(rating => rating.agencyIconSrc)}
      data={ratings}
      rowKeyExtractor={row => row.agencyName}
      columns={columns}
      rowOnClick={hasReportUrl ? handleRowClick : undefined}
      tableLayout="auto"
      className={className}
      contentClassName="max-w-none"
    />
  );
};
