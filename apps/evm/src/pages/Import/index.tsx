import { Page } from 'components';
import ImportablePositions from 'containers/ImportablePositions';

const Import: React.FC = () => (
  <Page>
    <div className="max-w-[800px] mx-auto">
      <ImportablePositions wrapInCard />
    </div>
  </Page>
);

export default Import;
