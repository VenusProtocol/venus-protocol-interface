import { type ButtonProps, ButtonWrapper } from '@venusprotocol/ui';

import { VENUS_COMMUNITY_URL } from 'constants/production';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';

export interface GovernanceForumButtonProps extends Partial<ButtonProps> {}

export const GovernanceForumButton: React.FC<GovernanceForumButtonProps> = ({ ...otherProps }) => {
  const { t } = useTranslation();

  return (
    <ButtonWrapper asChild {...otherProps}>
      <Link noStyle href={VENUS_COMMUNITY_URL}>
        {t('landing.governance.buttonLabel')}
      </Link>
    </ButtonWrapper>
  );
};
