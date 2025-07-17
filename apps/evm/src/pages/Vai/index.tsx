import { Card, Notice, Page, Tabs } from 'components';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';

import { Borrow } from './Borrow';
import { Repay } from './Repay';

const Vai: React.FC = () => {
  const { t, Trans } = useTranslation();

  const tabsContent = [
    { title: t('vai.borrow.tabTitle'), content: <Borrow /> },
    { title: t('vai.repay.tabTitle'), content: <Repay /> },
  ];

  return (
    <Page indexWithSearchEngines={false}>
      <div className="mx-auto w-full max-w-[544px]">
        <Notice
          className="mb-4 sm:mb-6"
          description={
            <Trans
              i18nKey="vai.headerMessage"
              components={{
                Link: <Link href="https://docs-v4.venus.io/guides/borrowing-vai" />,
              }}
            />
          }
        />

        <Card>
          <Tabs tabsContent={tabsContent} />
        </Card>
      </div>
    </Page>
  );
};

export default Vai;
