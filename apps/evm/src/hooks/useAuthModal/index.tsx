import { store } from './store';

export const useAuthModal = () => {
  const isAuthModalOpen = store.use.isAuthModalOpen();
  const setIsAuthModalOpen = store.use.setIsAuthModalOpen();
  const openAuthModal = () => setIsAuthModalOpen({ isAuthModalOpen: true });
  const closeAuthModal = () => setIsAuthModalOpen({ isAuthModalOpen: false });

  return {
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
  };
};
