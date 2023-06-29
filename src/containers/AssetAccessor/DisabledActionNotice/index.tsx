/** @jsxImportSource @emotion/react */
import { NoticeWarning, TokenAnnouncement } from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { Token, TokenAction } from 'types';

export interface DisabledActionNoticeProps {
  token: Token;
  action: TokenAction;
}

const DisabledActionNotice: React.FC<DisabledActionNoticeProps> = ({ token, action }) => {
  const { t } = useTranslation();

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
  });

  return tokenAnnouncementDom || <NoticeWarning description={getDescription()} />;
};

export default DisabledActionNotice;
