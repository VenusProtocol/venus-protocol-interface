/** @jsxImportSource @emotion/react */
import { NoticeWarning, TokenAnnouncement } from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { Token, TokenAction } from 'types';

import { useAuth } from 'context/AuthContext';

export interface DisabledActionNoticeProps {
  token: Token;
  action: TokenAction;
}

const DisabledActionNotice: React.FC<DisabledActionNoticeProps> = ({ token, action }) => {
  const { t } = useTranslation();
  const { chainId } = useAuth();

  const getDescription = () => {
    if (action === 'supply') {
      return t('operationModal.disabledActionNotice.supply');
    }

    if (action === 'withdraw') {
      return t('operationModal.disabledActionNotice.withdraw');
    }

    if (action === 'borrow') {
      return t('operationModal.disabledActionNotice.borrow');
    }

    return t('operationModal.disabledActionNotice.repay');
  };

  const tokenAnnouncementDom = TokenAnnouncement({
    token,
    chainId,
  });

  return tokenAnnouncementDom || <NoticeWarning description={getDescription()} />;
};

export default DisabledActionNotice;
