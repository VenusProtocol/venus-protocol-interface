import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

import { Redirect } from 'containers/Redirect';
import { useGetHomePagePath } from 'hooks/useGetHomePagePath';
import { useAccountAddress } from 'libs/wallet';
import { NewPage } from './NewPage';
import { OldPage } from './OldPage';

const Account: React.FC = () => {
  const { accountAddress } = useAccountAddress();
  const { homePagePath } = useGetHomePagePath();
  const isNewAccountPageEnabled = useIsFeatureEnabled({ name: 'newAccountPage' });

  if (!accountAddress) {
    return <Redirect to={homePagePath} />;
  }

  return isNewAccountPageEnabled ? <NewPage /> : <OldPage />;
};

export default Account;
