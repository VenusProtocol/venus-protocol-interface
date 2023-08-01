/** @jsxImportSource @emotion/react */
import { Box } from '@mui/material';
import { NoticeInfo, SecondaryButton } from 'components';
import React, { useRef } from 'react';
import { useTranslation } from 'translation';

import { useStyles } from './styles';
import TEST_IDS from '../testIds';

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
                // eslint-disable-next-line jsx-a11y/anchor-has-content
                <a
                  href="https://github.com/VenusProtocol/venus-protocol-interface/tree/main/src/utilities/importJsonProposal/samples/vip-123.json"
                  rel="noreferrer"
                />
              ),
            }}
          />
        }
      />
    </div>
  );
};

export default UploadOrManualProposal;
