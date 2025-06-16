import { useGetProfitableImports } from 'hooks/useGetProfitableImports';
import { useMeeClient } from 'libs/wallet';

export const useShouldDisplayImportUi = () => {
  const { supplyPositions: importableSupplyPositions } = useGetProfitableImports();
  const { data: getMeeClientData } = useMeeClient();
  const isMeeClientInitialized = !!getMeeClientData;

  const importablePositionsCount = Object.values(importableSupplyPositions).reduce(
    (acc, positions) => acc + positions.length,
    0,
  );

  const shouldDisplayImportUi = isMeeClientInitialized && importablePositionsCount > 0;

  return { shouldDisplayImportUi, importablePositionsCount };
};
