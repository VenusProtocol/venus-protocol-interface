import copyToClipboard from 'copy-to-clipboard';
import { useTranslation } from 'translation';

import { toast } from 'components/Toast';

const useCopyToClipboard = (name: string) => {
  const { t } = useTranslation();
  return (str: string) => {
    copyToClipboard(str);
    toast.success({
      message: t('interactive.copyToClipboard', { name }),
    });
  };
};

export default useCopyToClipboard;
