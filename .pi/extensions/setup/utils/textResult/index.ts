export const textResult = (text: string) => ({
  content: [{ type: 'text' as const, text }],
  details: {},
});
