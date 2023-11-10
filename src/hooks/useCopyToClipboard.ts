import copyToClipboard from 'copy-to-clipboard';
import { useCallback } from 'react';
import { useTranslation } from 'translation';
import { displayNotification } from 'utilities';

const useCopyToClipboard = (name: string) => {
  const { t } = useTranslation();

  return useCallback(
    (str: string) => {
      copyToClipboard(str);

      displayNotification({
        description: t('interactive.copyToClipboard', { name }),
        variant: 'success',
      });
    },
    [name, t],
  );
};

export default useCopyToClipboard;
