export const getMarketTabId = ({
  side,
  activeTabPath,
}: {
  side: 'supply' | 'borrow';
  activeTabPath: string[];
}) => {
  const [outerTabId, innerTabId] = activeTabPath;

  if (side === 'supply') {
    return outerTabId ?? 'supply';
  }

  if (outerTabId === 'loan') {
    return innerTabId ?? 'borrow';
  }

  return outerTabId === 'repay' ? 'repay' : 'borrow';
};
