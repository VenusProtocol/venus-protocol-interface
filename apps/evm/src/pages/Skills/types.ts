export type SequenceItemType =
  | 'user'
  | 'output'
  | 'blank'
  | 'header'
  | 'market'
  | 'balance'
  | 'position'
  | 'tx'
  | 'success'
  | 'cursor';

export interface SequenceItem {
  type: SequenceItemType;
  text?: string;
  color?: 'white' | 'gray' | 'green' | 'cyan' | 'yellow';
  rank?: string;
  name?: string;
  liquidity?: string;
  supply?: string;
  borrow?: string;
  token?: string;
  amount?: string;
  label?: string;
  value?: string;
  change?: string;
  status?: string;
  hash?: string;
}

export interface TerminalLine {
  item: SequenceItem;
  text: string;
  isComplete: boolean;
}

export type Translate = (key: string) => string;
