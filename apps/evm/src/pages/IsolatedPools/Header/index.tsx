/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';

import { useGetIsolatedPoolsTreasuryTotals } from 'clients/api';
import { Cell, CellGroup } from 'components';
import { useTranslation } from 'packages/translations';
import { formatCentsToReadableValue } from 'utilities';

import { useStyles } from './styles';

interface HeaderProps {
  treasurySupplyBalanceCents: BigNumber;
  treasuryBorrowBalanceCents: BigNumber;
  treasuryLiquidityBalanceCents: BigNumber;
  treasuryBalanceCents: BigNumber;
}

export const HeaderUi: React.FC<HeaderProps> = ({
  treasurySupplyBalanceCents,
  treasuryBorrowBalanceCents,
  treasuryLiquidityBalanceCents,
  treasuryBalanceCents,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const cells: Cell[] = [
    {
      label: t('market.totalSupply'),
      value: formatCentsToReadableValue({ value: treasurySupplyBalanceCents }),
    },
    {
      label: t('market.totalBorrow'),
      value: formatCentsToReadableValue({ value: treasuryBorrowBalanceCents }),
    },
    {
      label: t('market.availableLiquidity'),
      value: formatCentsToReadableValue({ value: treasuryLiquidityBalanceCents }),
    },
    {
      label: t('market.totalTreasury'),
      value: formatCentsToReadableValue({ value: treasuryBalanceCents }),
    },
  ];

  return <CellGroup css={styles.cellGroup} cells={cells} />;
};

const Header = () => {
  // TODO: handle loading state (see VEN-591)
  const {
    data: {
      treasurySupplyBalanceCents,
      treasuryBorrowBalanceCents,
      treasuryLiquidityBalanceCents,
      treasuryBalanceCents,
    },
  } = useGetIsolatedPoolsTreasuryTotals();

  return (
    <HeaderUi
      treasurySupplyBalanceCents={treasurySupplyBalanceCents}
      treasuryBorrowBalanceCents={treasuryBorrowBalanceCents}
      treasuryLiquidityBalanceCents={treasuryLiquidityBalanceCents}
      treasuryBalanceCents={treasuryBalanceCents}
    />
  );
};

export default Header;
