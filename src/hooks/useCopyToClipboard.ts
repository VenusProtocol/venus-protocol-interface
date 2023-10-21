import copyToClipboard from 'copy-to-clipboard';
import { useTranslation } from 'translation';
import { displayNotification } from 'utilities';

const useCopyToClipboard = (name: string) => {
  const { t } = useTranslation();

  return (str: string) => {
    copyToClipboard(str);

    displayNotification({
      description: t('interactive.copyToClipboard', { name }),
      variant: 'success',
    });
  };
};

export default useCopyToClipboard;
