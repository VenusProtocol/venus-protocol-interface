import { cn } from '@venusprotocol/ui';
import { NoticeInfo } from 'components';
import { useTranslation } from 'libs/translations';

export interface NoticeProps {
  className?: string;
}

export const Notice: React.FC<NoticeProps> = ({ className }) => {
  const { Trans } = useTranslation();

  return (
    <NoticeInfo
      className={cn('text-grey bg-transparent', className)}
      description={
        <Trans
          i18nKey="importPositionsModal.limitNotice"
          components={{
            Number: <span className="text-offWhite" />,
          }}
        />
      }
    />
  );
};
