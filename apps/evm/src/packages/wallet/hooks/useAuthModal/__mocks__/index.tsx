export const useAuthModal = vi.fn(() => ({
  isAuthModalOpen: false,
  openAuthModal: vi.fn(),
  closeAuthModal: vi.fn(),
}));
