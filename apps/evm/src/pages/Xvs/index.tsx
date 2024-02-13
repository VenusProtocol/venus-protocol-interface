/** @jsxImportSource @emotion/react */
import { Notice } from 'components';
import { useTranslation } from 'libs/translations';

import Header from './Header';
import Table from './Table';
import { useStyles } from './styles';

const Xvs: React.FC = () => {
  const { t } = useTranslation();
  const styles = useStyles();

  return (
    <div>
      <Notice
        css={styles.assetWarningsWarningNotice}
        variant="warning"
        description={t('xvsPage.assetWarningsWarning')}
      />

      <Header css={styles.header} />
      <Table />
    </div>
  );
};

export default Xvs;
