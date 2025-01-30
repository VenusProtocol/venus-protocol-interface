import type { Token } from 'types';

export interface Distribution {
  name: string;
  value: string;
  token: Token;
  description?: string | React.ReactNode;
}
