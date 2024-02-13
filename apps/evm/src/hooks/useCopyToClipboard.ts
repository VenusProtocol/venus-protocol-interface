import copyToClipboard from 'copy-to-clipboard';
import { displayNotification } from 'libs/notifications';
import { useTranslation } from 'libs/translations';
import { useCallback } from 'react';

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
