import { useGetProfitableImports } from 'hooks/useGetProfitableImports';
import { useMeeClient } from 'libs/wallet';

export const useShouldDisplayImportUi = () => {
  const { importablePositionsCount } = useGetProfitableImports();

  const { data: getMeeClientData } = useMeeClient();
  const isMeeClientInitialized = !!getMeeClientData;

  const shouldDisplayImportUi = isMeeClientInitialized && importablePositionsCount > 0;

  return { shouldDisplayImportUi, importablePositionsCount };
};
