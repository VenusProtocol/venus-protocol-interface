import { useTranslation } from 'libs/translations';

import { ConnectWallet } from 'containers/ConnectWallet';

import { Form } from './Form';

const MintVai: React.FC = () => {
  const { t } = useTranslation();

  return (
    <ConnectWallet message={t('vai.mintVai.connectWallet')}>
      <Form />
    </ConnectWallet>
  );
};

export default MintVai;
