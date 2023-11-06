import { NoticeWarning } from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Token, TokenAction } from 'types';

import { TokenAnnouncement } from 'containers/TokenAnnouncement';

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
  }, [action]);

  const tokenAnnouncementDom = TokenAnnouncement({
    token,
  });

  return tokenAnnouncementDom || (!!description && <NoticeWarning description={description} />);
};

export default DisabledActionNotice;
