import { Card, Notice, Tabs } from 'components';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';

import { Borrow } from './Borrow';

const VaiNew: React.FC = () => {
  const { t, Trans } = useTranslation();

  const tabsContent = [
    { title: t('vai.borrow.tabTitle'), content: <Borrow /> },
    { title: t('vai.repay.tabTitle'), content: <></> },
  ];

  return (
    <div className="mx-auto w-full max-w-[544px]">
      <Notice
        className="mb-6"
        description={
          <Trans
            i18nKey="vai.headerMessage"
            components={{
              Link: (
                // TODO: add correct href
                <Link href="https://google.com" />
              ),
            }}
          />
        }
      />

      <Card>
        <Tabs tabsContent={tabsContent} />
      </Card>
    </div>
  );
};

export default VaiNew;
