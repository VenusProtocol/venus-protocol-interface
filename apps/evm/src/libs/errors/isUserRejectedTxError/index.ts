export const isUserRejectedTxError = ({ error }: { error: unknown }) =>
  error instanceof Error && error.message.toLowerCase().startsWith('user rejected');
