import { ButtonWrapper, cn } from '@venusprotocol/ui';
import { useGetTopMarkets } from 'clients/api/queries/getTopMarkets/useGetTopMarkets';
import { Icon, Table } from 'components';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useIsLgDown, useIsSmDown } from 'hooks/responsive';
import { useTranslation } from 'libs/translations';
import { useColumns } from './columns';

interface IMarketProps {
  className?: string;
}

export const Markets: React.FC<IMarketProps> = ({ className }) => {
  const { t } = useTranslation();

  const isSmDown = useIsSmDown();
  const isLgDown = useIsLgDown();

  const { data, isLoading } = useGetTopMarkets({ limit: 6 });
  const tempList = data?.result ?? [];

  const listData = isSmDown ? tempList.slice(0, 3) : isLgDown ? tempList.slice(0, 4) : tempList;

  const { columns } = useColumns();

  return (
    <div className={cn(className)}>
      <Table
        columns={columns}
        data={listData}
        rowKeyExtractor={row => row.address}
        className="bg-transparent"
        isFetching={isLoading}
        cellHeight={'72px'}
        breakpoint="lg"
        cardClassName={cn(
          'bg-transparent rounded-2 border border-solid border-dark-blue-hover',
          '[&_.table-card-content]:gap-6',
          '[&_.table-card-content-row]:flex-row [&_.table-card-content-row]:justify-between [&_.table-card-content-row-label]:text-[14px]! [&_.table-card-content-row-value]:pt-0!',
        )}
      />

      <ButtonWrapper asChild variant="quinary" className="mx-auto my-7 h-11.25">
        <Link
          to={routes.markets.path}
          noStyle
          className="flex items-center w-fit gap-3 text-[16px]"
        >
          {t('landing.markets.exploreMore')}
          <Icon name="link" />
        </Link>
      </ButtonWrapper>
    </div>
  );
};
