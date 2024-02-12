import { useMemo } from 'react';

import { NoticeWarning } from 'components';
import { TokenAnnouncement } from 'containers/TokenAnnouncement';
import { useTranslation } from 'packages/translations';
import { Token, TokenAction } from 'types';

export interface DisabledActionNoticeProps {
  token: Token;
  action: TokenAction;
}

const DisabledActionNotice: React.FC<DisabledActionNoticeProps> = ({ token, action }) => {
  const { t } = useTranslation();

  const description: string | undefined = useMemo(() => {
    if (action === 'supply') {
      return t('operationModal.disabledActionNotice.supply');
    }

    if (action === 'withdraw') {
      return t('operationModal.disabledActionNotice.withdraw');
    }

    if (action === 'borrow') {
      return t('operationModal.disabledActionNotice.borrow');
    }

    if (action === 'repay') {
      return t('operationModal.disabledActionNotice.repay');
    }
  }, [action, t]);

  const tokenAnnouncementDom = TokenAnnouncement({
    token,
  });

  return tokenAnnouncementDom || (!!description && <NoticeWarning description={description} />);
};

export default DisabledActionNotice;
