import { NoticeInfo } from 'components';
import { PRIME_DOC_URL } from 'constants/prime';
import { Link } from 'containers/Link';
import { useTranslation } from 'packages/translations';

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
