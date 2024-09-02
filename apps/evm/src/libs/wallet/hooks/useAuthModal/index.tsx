import { useModal } from 'connectkit';

export const useAuthModal = () => {
  const { open, setOpen } = useModal();

  return {
    isAuthModalOpen: open,
    openAuthModal: () => setOpen(true),
    closeAuthModal: () => setOpen(false),
  };
};
