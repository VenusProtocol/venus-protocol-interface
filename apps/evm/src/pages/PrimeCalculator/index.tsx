import { NoticeInfo } from 'components';
import { PRIME_DOC_URL } from 'constants/prime';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';

import { Redirect } from 'containers/Redirect';
import { useGetHomePagePath } from 'hooks/useGetHomePagePath';
import { useAccountAddress } from 'libs/wallet';
import { Form } from './Form';

const PrimeCalculator: React.FC = () => {
  const { Trans } = useTranslation();

  const { accountAddress } = useAccountAddress();
  const { homePagePath } = useGetHomePagePath();

  // redirect to Core pool page when account address doesn't exist
  if (!accountAddress) {
    return <Redirect to={homePagePath} />;
  }

  return (
    <div className="flex justify-center">
      <div className="max-w-[930px]">
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

        <Form />
      </div>
    </div>
  );
};

export default PrimeCalculator;
