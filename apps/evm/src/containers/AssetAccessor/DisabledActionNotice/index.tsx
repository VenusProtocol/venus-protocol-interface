import { useMemo } from 'react';

import { NoticeWarning } from 'components';
import { TokenAnnouncement } from 'containers/TokenAnnouncement';
import { useTranslation } from 'libs/translations';
import type { Token, TokenAction } from 'types';

export interface DisabledActionNoticeProps {
  token: Token;
  action: TokenAction;
}

const DisabledActionNotice: React.FC<DisabledActionNoticeProps> = ({ token, action }) => {
  const { t } = useTranslation();

  const description: string | undefined = useMemo(() => {
    if (action === 'supply') {
      return t('assetAccessor.disabledActionNotice.supply');
    }

    if (action === 'withdraw') {
      return t('assetAccessor.disabledActionNotice.withdraw');
    }

    if (action === 'borrow') {
      return t('assetAccessor.disabledActionNotice.borrow');
    }

    if (action === 'repay') {
      return t('assetAccessor.disabledActionNotice.repay');
    }
  }, [action, t]);

  const tokenAnnouncementDom = TokenAnnouncement({
    token,
  });

  return tokenAnnouncementDom || (!!description && <NoticeWarning description={description} />);
};

export default DisabledActionNotice;
