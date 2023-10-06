/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { useGetTokens } from 'packages/tokens';
import React from 'react';
import { ChainId, ProposalAction, Token, VToken } from 'types';
import { generateBscScanUrl } from 'utilities';

import { useGetVTokens } from 'clients/api';
import { useAuth } from 'context/AuthContext';
import { FormValues } from 'pages/Governance/ProposalList/CreateProposalModal/proposalSchema';

import formatSignature from './formatSignature';
import getContractName from './getContractName';
import { useStyles } from './styles';

interface ReadableActionSignatureUiProps {
  action: FormValues['actions'][number] | ProposalAction;
  vTokens: VToken[];
  tokens: Token[];
  chainId: ChainId;
  className?: string;
}

export const ReadableActionSignatureUi: React.FC<ReadableActionSignatureUiProps> = ({
  action,
  vTokens,
  tokens,
  chainId,
  className,
}) => {
  const styles = useStyles();

  const contractName = getContractName({
    target: action.target,
    vTokens,
    tokens,
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

export type ReadableActionSignatureProps = Omit<
  ReadableActionSignatureUiProps,
  'vTokens' | 'chainId'
>;

export const ReadableActionSignature: React.FC<ReadableActionSignatureProps> = props => {
  const { chainId } = useAuth();
  const { data: getVTokensData } = useGetVTokens();
  const tokens = useGetTokens();
  const vTokens = getVTokensData?.vTokens || [];

  return (
    <ReadableActionSignatureUi {...props} chainId={chainId} vTokens={vTokens} tokens={tokens} />
  );
};
