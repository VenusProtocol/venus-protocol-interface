/** @jsxImportSource @emotion/react */
import { Box } from '@mui/material';
import { useRef } from 'react';

import { NoticeInfo, SecondaryButton } from 'components';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';

import TEST_IDS from '../testIds';
import { useStyles } from './styles';

interface UploadOrManualProposalProps {
  onClickUploadFile: (file: File | null) => void;
  onClickCreateManually: () => void;
}

const UploadOrManualProposal: React.FC<UploadOrManualProposalProps> = ({
  onClickCreateManually,
  onClickUploadFile,
}) => {
  const inputFile = useRef<HTMLInputElement | null>(null);
  const { t, Trans } = useTranslation();
  const styles = useStyles();

  const handleClickUploadFile = () => {
    inputFile.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const file = e.target.files ? e.target.files[0] : null;
    onClickUploadFile(file);
  };

  return (
    <div>
      <Box css={styles.options}>
        <input
          type="file"
          accept=".json"
          id="proposalFile"
          ref={inputFile}
          css={styles.fileInput}
          data-testid={TEST_IDS.fileInput}
          onChange={handleFileUpload}
        />
        <SecondaryButton css={styles.option} onClick={handleClickUploadFile}>
          {t('vote.createProposalModal.uploadFile')}
        </SecondaryButton>
        <SecondaryButton css={styles.option} onClick={onClickCreateManually}>
          {t('vote.createProposalModal.createManually')}
        </SecondaryButton>
      </Box>
      <NoticeInfo
        description={
          <Trans
            i18nKey="vote.createProposalModal.youCanEitherCreateManuallyOrUpload"
            components={{
              Link: (
                <Link href="https://github.com/VenusProtocol/venus-protocol-interface/blob/main/src/assets/proposals/vip-123.json" />
              ),
            }}
          />
        }
      />
    </div>
  );
};

export default UploadOrManualProposal;
