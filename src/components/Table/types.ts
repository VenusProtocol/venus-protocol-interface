import React from 'react';

export interface TableRowProps {
  key: string | number;
  render: () => React.ReactNode | string;
  value: string | number | boolean;
}
