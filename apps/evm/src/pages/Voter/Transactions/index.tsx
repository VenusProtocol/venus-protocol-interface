/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { useMemo } from 'react';

import { ButtonWrapper, Card, Icon, Spinner, Table, type TableColumn } from 'components';
import { Link } from 'containers/Link';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useChainId } from 'libs/wallet';
import { type VoteDetail, VoteSupport } from 'types';
import { convertMantissaToTokens, generateChainExplorerUrl } from 'utilities';

import { useStyles } from './styles';

interface TransactionsProps {
  address: string;
  voterTransactions: VoteDetail[] | undefined;
  className?: string;
}

export const Transactions: React.FC<TransactionsProps> = ({
  className,
  address,
  voterTransactions = [],
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { chainId } = useChainId();
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const columns: TableColumn<VoteDetail>[] = useMemo(
    () => [
      {
        accessorKey: 'support',
        header: t('voterDetail.actions'),
        cell: ({ row }) => {
          switch (row.original.support) {
            case VoteSupport.Against:
              return (
                <div css={styles.row}>
                  <div css={[styles.icon, styles.against]}>
                    <Icon name="closeRounded" />
                  </div>
                  {t('voterDetail.votedAgainst')}
                </div>
              );
            case VoteSupport.For:
              return (
                <div css={styles.row}>
                  <div css={[styles.icon, styles.for]}>
                    <Icon name="mark" className="text-offWhite" />
                  </div>
                  {t('voterDetail.votedFor')}
                </div>
              );
            case VoteSupport.Abstain:
              return (
                <div css={styles.row}>
                  <div css={[styles.icon, styles.abstain]}>
                    <Icon name="dots" />
                  </div>
                  {t('voterDetail.votedAbstain')}
                </div>
              );
            default:
              return <></>;
          }
        },
      },
      {
        accessorKey: 'blockTimestamp',
        header: t('voterDetail.sent'),
        cell: ({ row }) => t('voterDetail.readableSent', { date: row.original.blockTimestamp }),
      },
      {
        accessorFn: row => row.votesMantissa.toNumber(),
        header: t('voterDetail.amount'),
        cell: ({ row }) =>
          convertMantissaToTokens({
            value: row.original.votesMantissa,
            token: xvs,
            returnInReadableFormat: true,
          }),
      },
    ],
    [t, xvs, styles.abstain, styles.against, styles.for, styles.icon, styles.row],
  );

  return (
    <Card css={styles.root} className={className}>
      <Typography css={styles.horizontalPadding} variant="h4">
        {t('voterDetail.transactions')}
      </Typography>

      {voterTransactions?.length ? (
        <Table columns={columns} data={voterTransactions} />
      ) : (
        <Spinner css={styles.spinner} />
      )}

      <ButtonWrapper
        variant="secondary"
        className="text-offWhite mt-4 hover:no-underline sm:mx-6 sm:mt-0"
        asChild
      >
        <Link
          href={generateChainExplorerUrl({
            hash: address,
            urlType: 'address',
            chainId,
          })}
        >
          {t('voterDetail.viewAll')}
        </Link>
      </ButtonWrapper>
    </Card>
  );
};

export default Transactions;
