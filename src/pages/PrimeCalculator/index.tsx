import { NoticeInfo } from 'components';
import { PRIME_DOC_URL } from 'constants/prime';
import { Link } from 'containers/Link';
import { useTranslation } from 'packages/translations';

import { Form } from './Form';

const PrimeCalculator: React.FC = () => {
  const { Trans } = useTranslation();

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

      <Form />
    </div>
  );
};

export default PrimeCalculator;
