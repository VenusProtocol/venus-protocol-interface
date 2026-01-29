import { NoticeInfo } from 'components';
import { VENUS_PRIME_DOC_URL } from 'constants/production';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';

import { Form } from './Form';

const PrimeCalculator: React.FC = () => {
  const { Trans } = useTranslation();

  return (
    <div className="flex justify-center">
      <div className="max-w-[930px]">
        <NoticeInfo
          className="mb-6"
          description={
            <Trans
              i18nKey="primeCalculator.topMessage"
              components={{
                Link: <Link href={VENUS_PRIME_DOC_URL} />,
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
