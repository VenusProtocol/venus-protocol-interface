import { useGetProfitableImports } from 'hooks/useGetProfitableImports';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { useAccountAddress } from 'libs/wallet';
import { useMeeClient } from 'libs/wallet';
import { Suspense } from 'react';
import { safeLazyLoad } from 'utilities';

const Modal = safeLazyLoad(() => import('./Modal'));

const ImportPositionsModal: React.FC = () => {
  const { accountAddress } = useAccountAddress();
  const [userChainSettings] = useUserChainSettings();
  const { importablePositionsCount } = useGetProfitableImports();
  const { data: getMeeClientData } = useMeeClient();

  if (
    !accountAddress ||
    userChainSettings.doNotShowImportPositionsModal ||
    importablePositionsCount === 0 ||
    !getMeeClientData
  ) {
    return undefined;
  }

  return (
    <Suspense>
      <Modal />
    </Suspense>
  );
};

export default ImportPositionsModal;
