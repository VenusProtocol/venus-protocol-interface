import { ButtonWrapper, Card } from 'components';
import { ConnectWallet } from 'containers/ConnectWallet';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';

export interface PlaceholderProps {
  title: string;
  description?: string;
  to?: string;
  onButtonClick?: () => void;
}

export const Placeholder: React.FC<PlaceholderProps> = ({
  title,
  description,
  to,
  onButtonClick,
}) => {
  const { t } = useTranslation();

  return (
    <Card className="flex min-h-60.5 flex-col items-center justify-center gap-3 p-3 text-center">
      <h2 className="text-b1r">{title}</h2>

      {description && <p className="text-b1r text-grey">{description}</p>}

      {!!to && (
        <ConnectWallet className="w-fit">
          <ButtonWrapper className="text-white hover:no-underline" asChild>
            <Link noStyle to={to} onClick={onButtonClick}>
              {t('account.placeholder.buttonLabel')}
            </Link>
          </ButtonWrapper>
        </ConnectWallet>
      )}
    </Card>
  );
};
