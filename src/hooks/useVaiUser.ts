import { useContext } from 'react';
import { VaiContext } from '../context/VaiContext';

export const useVaiUser = () => {
  const { userVaiMinted, userVaiBalance, userVaiEnabled, mintableVai } = useContext(VaiContext);
  return {
    userVaiMinted,
    userVaiBalance,
    userVaiEnabled,
    mintableVai,
  };
};
