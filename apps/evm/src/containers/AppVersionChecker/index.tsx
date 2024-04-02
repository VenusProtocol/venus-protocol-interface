import { compareVersions } from 'compare-versions';
import { useEffect } from 'react';

import { useGetLatestAppVersion } from 'clients/api';
import { version as APP_VERSION } from 'constants/version';
import { getLocalAppVersion } from 'libs/appVersion';
import { displayNotification } from 'libs/notifications';
import { useTranslation } from 'libs/translations';

const AppVersionChecker: React.FC = () => {
  const { t } = useTranslation();
  const { data } = useGetLatestAppVersion();
  const latestAppVersion = data?.version;

  useEffect(() => {
    const fn = async () => {
      const localAppVersion = await getLocalAppVersion();
      console.log('localAppVersion', localAppVersion);
    };

    fn();

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
