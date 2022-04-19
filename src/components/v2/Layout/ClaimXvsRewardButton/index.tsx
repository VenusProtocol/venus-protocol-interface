/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';

import { AuthContext } from 'context/AuthContext';
import { useGetXvsReward } from 'clients/api';
import { useTranslation } from 'translation';
import { convertWeiToCoins } from 'utilities/common';
import { Icon } from '../../Icon';
import { SecondaryButton, IButtonProps } from '../../Button';
import { useStyles } from './styles';

const XVS_SYMBOL = 'xvs';

export interface IClaimXvsRewardButton extends IButtonProps {
  amountWei?: BigNumber;
}

export const ClaimXvsRewardButtonUi: React.FC<IClaimXvsRewardButton> = ({
  amountWei,
  ...otherProps
}) => {
  const { Trans } = useTranslation();
  const styles = useStyles();

  if (!amountWei) {
    return null;
  }

  const readableAmount = convertWeiToCoins({
    value: amountWei,
    tokenSymbol: XVS_SYMBOL,
    returnInReadableFormat: true,
  });

  return (
    <SecondaryButton css={styles.button} {...otherProps}>
      <Trans
        i18nKey="claimXvsRewardButton.title"
        components={{
          Icon: <Icon css={styles.icon} name={XVS_SYMBOL} />,
        }}
        values={{
          amount: readableAmount,
        }}
      />
    </SecondaryButton>
  );
};

export const ClaimXvsRewardButton: React.FC<IButtonProps> = props => {
  const { account } = React.useContext(AuthContext);
  const { data: xvsRewardWei } = useGetXvsReward(account?.address);

  const claimXvs = () => {
    // @TODO: send transaction to claim XVS
  };

  return <ClaimXvsRewardButtonUi amountWei={xvsRewardWei} onClick={claimXvs} {...props} />;
};

export default ClaimXvsRewardButton;
