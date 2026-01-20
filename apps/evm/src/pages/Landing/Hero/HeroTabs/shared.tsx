import { ButtonWrapper, type TokenIconProps } from 'components';
import { Link } from 'containers/Link';
import { useGetMarketsPagePath } from 'hooks/useGetMarketsPagePath';
import { useTranslation } from 'libs/translations';
import type { Token } from 'types';

export const BASE_AMOUNT = 10_000;

export type Props = TokenIconProps & {
  token?: Token;
  apy?: BigNumber;
};

export const StartNowBtn: React.FC = () => {
  const { t } = useTranslation();

  const { marketsPagePath } = useGetMarketsPagePath();
  return (
    <ButtonWrapper asChild className="mt-6 h-12 w-full text-b1s" variant="tertiary">
      <Link to={marketsPagePath} noStyle>
        {t('landing.hero.startNow')}
      </Link>
    </ButtonWrapper>
  );
};
