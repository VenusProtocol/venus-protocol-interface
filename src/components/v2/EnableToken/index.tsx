/** @jsxImportSource @emotion/react */
import React, { useContext } from 'react';
import BigNumber from 'bignumber.js';
import Typography from '@mui/material/Typography';

import { useTranslation } from 'translation';
import { AuthContext } from 'context/AuthContext';
import { VTokenId } from 'types';
import { getVBepToken, getContractAddress } from 'utilities';
import { useApproveToken, useGetAllowance } from 'clients/api';
import { Icon } from '../Icon';
import { SecondaryButton } from '../Button';
import useStyles from './styles';
import { Delimiter } from '../Delimiter';
import { LabeledInlineContent, ILabeledInlineContentProps } from '../LabeledInlineContent';
import { Spinner } from '../Spinner';

export interface IEnableTokenUiProps {
  vTokenId: VTokenId | 'vai' | 'vrt';
  title: string | React.ReactElement;
  isTokenEnabled: boolean;
  enableToken: () => void;
  isInitialLoading?: boolean;
  isEnableTokenLoading?: boolean;
  tokenInfo?: ILabeledInlineContentProps[];
  disabled?: boolean;
}

export const EnableTokenUi: React.FC<IEnableTokenUiProps> = ({
  vTokenId,
  title,
  tokenInfo = [],
  children,
  enableToken,
  isTokenEnabled,
  isInitialLoading = false,
  isEnableTokenLoading = false,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  if (isTokenEnabled) {
    return <>{children}</>;
  }

  return (
    <div css={styles.container}>
      {isInitialLoading ? (
        <Spinner />
      ) : (
        <>
          <Icon name={vTokenId} css={styles.mainLogo} />

          <Typography component="h3" variant="h3" css={styles.mainText}>
            {title}
          </Typography>

          {tokenInfo.length > 0 && (
            <div css={styles.tokenInfoContainer}>
              <Delimiter css={styles.delimiter} />

              {tokenInfo.map(info => (
                <LabeledInlineContent
                  {...info}
                  key={info.label}
                  css={styles.labeledInlineContent}
                />
              ))}
            </div>
          )}

          <SecondaryButton
            disabled={disabled || isEnableTokenLoading}
            loading={isEnableTokenLoading}
            fullWidth
            onClick={enableToken}
          >
            {t('enableToken.enableButtonLabel')}
          </SecondaryButton>
        </>
      )}
    </div>
  );
};

export type EnableTokenProps = Pick<
  IEnableTokenUiProps,
  'tokenInfo' | 'disabled' | 'title' | 'vTokenId'
>;

export const EnableToken: React.FC<EnableTokenProps> = ({ vTokenId, ...rest }) => {
  const { account } = useContext(AuthContext);

  let vTokenAddress = '';
  if (vTokenId === 'vai') {
    vTokenAddress = getContractAddress('vaiUnitroller');
  } else if (vTokenId === 'vrt') {
    vTokenAddress = getContractAddress('vrtConverterProxy');
  } else {
    vTokenAddress = getVBepToken(vTokenId).address;
  }

  // TODO: handle errors
  const { data: tokenAllowance, isLoading: isGetAllowanceLoading } = useGetAllowance(
    {
      accountAddress: account?.address || '',
      spenderAddress: vTokenAddress,
      tokenId: vTokenId,
    },
    {
      enabled: !!account?.address,
    },
  );

  const isTokenApproved =
    vTokenId === 'bnb' || (!!tokenAllowance && new BigNumber(tokenAllowance).isGreaterThan(0));

  const { mutate: contractApproveToken, isLoading: isApproveTokenLoading } = useApproveToken({
    assetId: vTokenId,
  });

  const approveToken = () => {
    if (account?.address) {
      contractApproveToken({
        accountAddress: account.address,
        vtokenAddress: vTokenAddress,
      });
    }
  };

  return (
    <EnableTokenUi
      {...rest}
      vTokenId={vTokenId}
      enableToken={approveToken}
      isTokenEnabled={isTokenApproved}
      isEnableTokenLoading={isApproveTokenLoading}
      isInitialLoading={isGetAllowanceLoading}
      disabled={!account}
    />
  );
};

export default EnableToken;
