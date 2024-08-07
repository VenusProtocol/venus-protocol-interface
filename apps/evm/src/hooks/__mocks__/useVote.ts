const vote = vi.fn();

export default vi.fn(() => ({
  vote,
  isLoading: false,
}));
