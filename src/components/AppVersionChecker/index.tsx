import React, { useEffect } from 'react';
import { useTranslation } from 'translation';

import { useGetLatestAppVersion } from 'clients/api';
import { toast } from 'components/Toast';
import { version as APP_VERSION } from 'constants/version';

interface AppVersionCheckerUiProps {
  latestAppVersion?: string;
}

const AppVersionCheckerUi: React.FC<AppVersionCheckerUiProps> = ({ latestAppVersion }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (latestAppVersion && latestAppVersion !== APP_VERSION) {
      toast.info(
        {
          message: t('appVersionChecker.newVersionMessage'),
        },
        {
          autoClose: false,
        },
      );
    }
  }, [latestAppVersion]);

  return null;
};

export const AppVersionChecker: React.FC = () => {
  const { data } = useGetLatestAppVersion();
  const latestAppVersion = data?.version;

  return <AppVersionCheckerUi latestAppVersion={latestAppVersion} />;
};
