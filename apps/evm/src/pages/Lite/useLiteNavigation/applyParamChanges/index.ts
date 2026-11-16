export const applyParamChanges = ({
  previous,
  changes,
}: {
  previous: URLSearchParams;
  changes: Record<string, string | undefined>;
}) => {
  const next = new URLSearchParams(previous);

  Object.entries(changes).forEach(([key, value]) => {
    if (value === undefined) {
      next.delete(key);
      return;
    }

    next.set(key, value);
  });

  return next;
};
