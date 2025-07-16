import { Page } from 'components';
import ImportablePositions from 'containers/ImportablePositions';

const Port: React.FC = () => (
  <Page>
    <div className="max-w-[800px] mx-auto">
      <ImportablePositions wrapInCard />
    </div>
  </Page>
);

export default Port;
