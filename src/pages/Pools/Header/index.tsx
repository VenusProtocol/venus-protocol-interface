/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { Cell, CellGroup } from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { formatCentsToReadableValue } from 'utilities';

import { useGetTreasuryTotals } from 'clients/api';

import { useStyles } from './styles';

interface HeaderProps {
  totalSupplyCents: BigNumber;
  totalBorrowCents: BigNumber;
  availableLiquidityCents: BigNumber;
  totalTreasuryCents: BigNumber;
}

export const HeaderUi: React.FC<HeaderProps> = ({
  totalSupplyCents,
  totalBorrowCents,
  availableLiquidityCents,
  totalTreasuryCents,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const cells: Cell[] = [
    {
      label: t('market.totalSupply'),
      value: formatCentsToReadableValue({ value: totalSupplyCents }),
    },
    {
      label: t('market.totalBorrow'),
      value: formatCentsToReadableValue({ value: totalBorrowCents }),
    },
    {
      label: t('market.availableLiquidity'),
      value: formatCentsToReadableValue({ value: availableLiquidityCents }),
    },
    {
      label: t('market.totalTreasury'),
      value: formatCentsToReadableValue({ value: totalTreasuryCents }),
    },
  ];

  return <CellGroup css={styles.cellGroup} cells={cells} />;
};

const Header = () => {
  // TODO: handle loading state (see VEN-591)
  const {
    data: {
      treasuryTotalSupplyBalanceCents,
      treasuryTotalBorrowBalanceCents,
      treasuryTotalAvailableLiquidityBalanceCents,
      treasuryTotalBalanceCents,
    },
  } = useGetTreasuryTotals();

  return (
    <HeaderUi
      totalSupplyCents={treasuryTotalSupplyBalanceCents}
      totalBorrowCents={treasuryTotalBorrowBalanceCents}
      availableLiquidityCents={treasuryTotalAvailableLiquidityBalanceCents}
      totalTreasuryCents={treasuryTotalBalanceCents}
    />
  );
};

export default Header;
