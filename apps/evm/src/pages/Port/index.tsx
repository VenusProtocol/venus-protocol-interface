import { Page } from 'components';
import ImportablePositions from 'containers/ImportablePositions';
import { Redirect } from 'containers/Redirect';
import { useGetHomePagePath } from 'hooks/useGetHomePagePath';
import { useAccountAddress } from 'libs/wallet';

const Port: React.FC = () => {
  const { accountAddress } = useAccountAddress();
  const { homePagePath } = useGetHomePagePath();

  // redirect to Core pool page when account address doesn't exist
  if (!accountAddress) {
    return <Redirect to={homePagePath} />;
  }

  return (
    <Page>
      <div className="max-w-[800px] mx-auto">
        <ImportablePositions wrapInCard />
      </div>
    </Page>
  );
};

export default Port;
