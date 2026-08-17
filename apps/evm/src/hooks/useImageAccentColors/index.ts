import { getPalette } from '@lauriys/react-palette';
import { useQueries } from '@tanstack/react-query';
import FunctionKey from 'constants/functionKey';

const fetchVibrantColor = async (imagePath: string) => {
  const palette = await getPalette(imagePath);
  if (!palette.vibrant) {
    throw new Error(`No vibrant color extracted from ${imagePath}`);
  }
  return palette.vibrant;
};

export const useImageAccentColors = (imagePaths: string[]) => {
  const uniquePaths = Array.from(new Set(imagePaths.filter(Boolean)));

  const results = useQueries({
    queries: uniquePaths.map(imagePath => ({
      queryKey: [FunctionKey.GET_IMAGE_ACCENT_COLOR, imagePath],
      queryFn: () => fetchVibrantColor(imagePath),
      staleTime: Number.POSITIVE_INFINITY,
    })),
  });

  const colors: Record<string, string> = {};
  uniquePaths.forEach((path, index) => {
    const color = results[index].data;
    if (color) {
      colors[path] = color;
    }
  });
  return colors;
};
