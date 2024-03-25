export const convertToDate = ({ timestampSeconds }: { timestampSeconds: number }) =>
  new Date(timestampSeconds * 1000);
