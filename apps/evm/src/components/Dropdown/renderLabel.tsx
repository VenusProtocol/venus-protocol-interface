import type { DropdownOption } from './types';

export const renderLabel = ({
  label,
  isRenderedInButton = false,
}: {
  label: DropdownOption['label'];
  isRenderedInButton?: boolean;
}) => {
  if (typeof label === 'function') {
    return label({ isRenderedInButton });
  }

  return label;
};
