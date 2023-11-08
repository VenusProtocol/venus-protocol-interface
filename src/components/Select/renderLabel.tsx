import { SelectOption } from './types';

export const renderLabel = ({
  label,
  isRenderedInButton = false,
}: {
  label: SelectOption['label'];
  isRenderedInButton?: boolean;
}) => {
  if (typeof label === 'function') {
    return label({ isRenderedInButton });
  }

  return label;
};
