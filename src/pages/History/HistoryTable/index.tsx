/** @jsxImportSource @emotion/react */
import React from 'react';

export interface IHistoryTableProps {
  transactions: [];
}

export const HistoryTableUi: React.FC<IHistoryTableProps> = () => <div />;

const HistoryTable = () => {
  return <HistoryTableUi transactions={[]}/>;
};

export default HistoryTable;
