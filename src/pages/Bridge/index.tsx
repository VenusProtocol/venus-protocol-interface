import { Card, Icon, TextButton } from 'components';
import { useTranslation } from 'packages/translations';
import { useChainId } from 'packages/wallet';

import { ChainSelect } from './ChainSelect';

// TODO: add ConnectWallet wrapper
const BridgePage: React.FC = () => {
  const { t } = useTranslation();
  const { chainId } = useChainId();

  const isSubmitting = false;

  return (
    <Card className="mx-auto w-full md:max-w-[544px]">
      <ChainSelect
        // TODO: wire up
        onChange={() => {}}
        value={chainId}
        label={t('bridgePage.fromChainSelect.label')}
        className="mb-4"
      />

      <TextButton
        className="mx-auto mb-2 flex h-auto p-2"
        // TODO: wire up
        onClick={() => {}}
        disabled={isSubmitting}
      >
        <Icon name="convert" className="h-6 w-6 rotate-90 text-blue" />
      </TextButton>

      <ChainSelect
        // TODO: wire up
        onChange={() => {}}
        value={chainId}
        label={t('bridgePage.toChainSelect.label')}
      />
    </Card>
  );
};

export default BridgePage;
