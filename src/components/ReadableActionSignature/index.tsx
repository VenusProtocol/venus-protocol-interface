/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import React from 'react';
import { IProposalAction } from 'types';
import { generateBscScanUrl } from 'utilities';

import { FormValues } from 'pages/Vote/CreateProposalModal/proposalSchema';

import formatSignature from './formatSignature';
import getContractName from './getContractName';
import { useStyles } from './styles';

interface IReadableActionSignatureProps {
  action: FormValues['actions'][number] | IProposalAction;
  className?: string;
}

export const ReadableActionSignature: React.FC<IReadableActionSignatureProps> = ({
  action,
  className,
}) => {
  const styles = useStyles();
  return (
    <Typography
      css={styles.signature}
      className={className}
      key={`${action.signature}-${action.target}`}
    >
      <Typography
        component="a"
        href={generateBscScanUrl(action.target, 'address')}
        target="_blank"
        rel="noreferrer"
      >
        {getContractName(action.target)}
      </Typography>
      {formatSignature(action)}
    </Typography>
  );
};
