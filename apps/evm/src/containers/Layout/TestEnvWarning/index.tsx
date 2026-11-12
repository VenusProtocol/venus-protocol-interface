import { cn } from '@venusprotocol/ui';

import config from 'config';
import { MAIN_PRODUCTION_HOST } from 'constants/production';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';

export interface TestEnvWarningProps {
  className?: string;
}

export const TestEnvWarning: React.FC<TestEnvWarningProps> = ({ className }) => {
  const { Trans } = useTranslation();

  if (config.environment === 'production' || config.environment === 'local') {
    return undefined;
  }

  return (
    <div className={cn('px-4 py-2 bg-danger text-on-color font-semibold text-center', className)}>
      {
        <Trans
          i18nKey="layout.testEnvWarning"
          components={{
            Link: (
              <Link
                className="text-on-color underline"
                target="_self"
                href={`https://${MAIN_PRODUCTION_HOST}`}
              />
            ),
          }}
        />
      }
    </div>
  );
};
