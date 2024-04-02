import { Button, NoticeError } from 'components';
import { useTranslation } from 'libs/translations';
import { cn } from 'utilities';

export interface ErrorStateProps {
  message?: string;
  button?: {
    label: string;
    onClick: () => unknown;
  };
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, button, className }) => {
  const { t } = useTranslation();

  return (
    <NoticeError
      className={cn('max-w-[400px] mx-auto', className)}
      description={
        <>
          <div className="mb-2">{message || t('errorState.defaultMessage')}</div>

          {button && (
            <Button variant="senary" className="hover:border-lightGrey" onClick={button.onClick}>
              {button.label}
            </Button>
          )}
        </>
      }
    />
  );
};
