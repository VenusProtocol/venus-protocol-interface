import { usePalette } from '@lauriys/react-palette';

export const useImageAccentColor = ({ imagePath }: { imagePath?: string }) => {
  const { data } = usePalette(imagePath || '');
  return { color: data.vibrant };
};
