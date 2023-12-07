import { NoticeInfo } from 'components';
import { PRIME_DOC_URL } from 'constants/prime';
import { Link } from 'containers/Link';
import { useGetToken } from 'packages/tokens';
import { useTranslation } from 'packages/translations';

import { Form } from './Form';
import { RewardDetails } from './RewardDetails';

const PrimeCalculator: React.FC = () => {
  const { Trans } = useTranslation();

  const usdt = useGetToken({
    symbol: 'USDT',
  });

  if (!usdt) {
    return null;
  }

  return (
    <div>
      <NoticeInfo
        className="mb-6"
        description={
          <Trans
            i18nKey="primeCalculator.topMessage"
            components={{
              Link: <Link href={PRIME_DOC_URL} />,
            }}
          />
        }
      />

      <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
        <Form />

        <RewardDetails
          primeBorrowApy="-"
          primeSupplyApy="-"
          token={usdt}
          totalYearlyRewards="-"
          userYearlyRewards="-"
          userSuppliedTokens="-"
          userBorrowedTokens="-"
        />
      </div>
    </div>
  );
};

export default PrimeCalculator;
