/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { useMemo } from 'react';

import { ButtonWrapper, Card, Icon, Spinner, Table, type TableColumn } from 'components';
import { Link } from 'containers/Link';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useChainId } from 'libs/wallet';
import { type VoteDetail, VoteSupport } from 'types';
import { convertMantissaToTokens, generateExplorerUrl } from 'utilities';

import { routes } from 'constants/routing';
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
        key: 'action',
        label: t('voterDetail.actions'),
        selectOptionLabel: t('voterDetail.actions'),
        renderCell: transaction => {
          switch (transaction.support) {
            case VoteSupport.Against:
              return (
                <div css={styles.row}>
                  <div css={[styles.icon, styles.against]}>
                    <Icon name="close" />
                  </div>
                  {t('voterDetail.votedAgainst')}
                </div>
              );
            case VoteSupport.For:
              return (
                <div css={styles.row}>
                  <div css={[styles.icon, styles.for]}>
                    <Icon name="mark" className="text-white" />
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
        key: 'proposalId',
        label: t('voterDetail.proposalNumber'),
        selectOptionLabel: t('voterDetail.proposalNumber'),
        renderCell: transaction => (
          <Link
            to={routes.governanceProposal.path.replace(
              ':proposalId',
              transaction.proposalId.toString(),
            )}
            className="text-white underline hover:text-blue"
          >
            {transaction.proposalId}
          </Link>
        ),
      },
      {
        key: 'amount',
        label: t('voterDetail.amount'),
        selectOptionLabel: t('voterDetail.amount'),
        align: 'right',
        renderCell: transaction =>
          convertMantissaToTokens({
            value: transaction.votesMantissa,
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
        <Table
          columns={columns}
          data={voterTransactions}
          rowKeyExtractor={row => `voter-transaction-table-row-${row.proposalId}`}
          breakpoint="sm"
          css={styles.cardContentGrid}
        />
      ) : (
        <Spinner css={styles.spinner} />
      )}

      <ButtonWrapper
        variant="secondary"
        className="text-white mt-4 hover:no-underline sm:mx-6 sm:mt-0"
        asChild
      >
        <Link
          href={generateExplorerUrl({
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
