export const useAnalytics = vi.fn(() => ({
  captureAnalyticEvent: vi.fn(),
}));

export const AnalyticProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => children;
