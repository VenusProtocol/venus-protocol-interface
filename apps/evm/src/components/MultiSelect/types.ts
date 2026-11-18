import type React from 'react';

export interface MultiSelectOption {
  value: string;
  label: React.ReactNode;
  // Text the search matches against. Defaults to the label when it is a string, otherwise the value.
  searchText?: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: React.ReactNode;
  renderCount: (count: number) => React.ReactNode;
  title: React.ReactNode;
  resetLabel: React.ReactNode;
  searchPlaceholder: string;
  noResultsLabel: React.ReactNode;
  size?: 'xs' | 'sm';
  className?: string;
  buttonClassName?: string;
}
