/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import React from 'react';
import { ProposalAction } from 'types';
import { generateBscScanUrl } from 'utilities';

import { useAuth } from 'context/AuthContext';
import { FormValues } from 'pages/Governance/ProposalList/CreateProposalModal/proposalSchema';

import formatSignature from './formatSignature';
import getContractName from './getContractName';
import { useStyles } from './styles';

interface ReadableActionSignatureProps {
  action: FormValues['actions'][number] | ProposalAction;
  className?: string;
}

export const ReadableActionSignature: React.FC<ReadableActionSignatureProps> = ({
  action,
  className,
}) => {
  const styles = useStyles();
  const { chainId } = useAuth();

  const contractName = getContractName({
    target: action.target,
    chainId,
  });

  return (
    <Typography css={styles.signature} className={className}>
      <Typography
        component="a"
        href={
          chainId &&
          generateBscScanUrl({
            hash: action.target,
            urlType: 'address',
            chainId,
          })
        }
        target="_blank"
        rel="noreferrer"
      >
        {contractName}
      </Typography>

      {formatSignature(action)}
    </Typography>
  );
};
