export const useStyles = () => ({
  getGridTemplateColumns: ({ isMobile }: { isMobile: boolean }) =>
    isMobile ? '1fr 1fr 120px' : '120px 1fr 1fr 1fr',
});
