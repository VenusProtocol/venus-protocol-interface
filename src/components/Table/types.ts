import React from 'react';

export interface ITableRowProps {
  key: string | number;
  render: () => React.ReactNode | string;
  value: string | number | boolean;
}
