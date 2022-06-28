import copyToClipboard from 'copy-to-clipboard';
import { toast } from 'components/v2/Toast';
import { useTranslation } from 'translation';

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
