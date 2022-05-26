/** @jsxImportSource @emotion/react */
import React from 'react';
import HistoryTable from './HistoryTable';

export const HistoryUi: React.FC = () => (
  <div>
    <HistoryTable />
  </div>
);

const History: React.FC = () => <HistoryUi />;

export default History;
