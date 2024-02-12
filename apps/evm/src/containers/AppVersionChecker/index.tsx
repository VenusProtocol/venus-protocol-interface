import { compareVersions } from 'compare-versions';
import { useEffect } from 'react';

import { useGetLatestAppVersion } from 'clients/api';
import { version as APP_VERSION } from 'constants/version';
import { displayNotification } from 'packages/notifications';
import { useTranslation } from 'packages/translations';

const AppVersionChecker: React.FC = () => {
  const { t } = useTranslation();
  const { data } = useGetLatestAppVersion();
  const latestAppVersion = data?.version;

  useEffect(() => {
    if (latestAppVersion && compareVersions(latestAppVersion, APP_VERSION)) {
      displayNotification({
        description: t('appVersionChecker.newVersionMessage'),
        autoClose: false,
      });
    }
  }, [latestAppVersion, t]);

  return null;
};

export default AppVersionChecker;
