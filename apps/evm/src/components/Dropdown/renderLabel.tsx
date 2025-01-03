export const renderLabel = ({
  label,
  isRenderedInButton = false,
}: {
  label:
    | string
    | React.ReactNode
    | ((context: { isRenderedInButton: boolean }) => string | React.ReactNode);
  isRenderedInButton?: boolean;
}) => {
  if (typeof label === 'function') {
    return label({ isRenderedInButton });
  }

  return label;
};
