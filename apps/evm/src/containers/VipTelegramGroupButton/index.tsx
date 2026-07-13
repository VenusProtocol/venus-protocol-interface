import { type ButtonProps, ButtonWrapper } from '@venusprotocol/ui';

import { Icon } from 'components';
import { VENUS_VIP_TELEGRAM_URL } from 'constants/vip';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';

export interface VipTelegramGroupButtonProps extends Omit<ButtonProps, 'children'> {}

export const VipTelegramGroupButton: React.FC<VipTelegramGroupButtonProps> = ({
  ...otherProps
}) => {
  const { t } = useTranslation();

  return (
    <ButtonWrapper asChild {...otherProps}>
      <Link noStyle href={VENUS_VIP_TELEGRAM_URL}>
        <div className="flex items-center gap-x-2">
          <span>{t('vipTelegramGroupButton.label')}</span>

          <Icon name="telegram" className="size-5 text-inherit transition-colors" />
        </div>
      </Link>
    </ButtonWrapper>
  );
};
