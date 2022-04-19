/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';

import { useTranslation } from 'translation';
import { AuthContext } from 'context/AuthContext';
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
  const { openAuthModal } = React.useContext(AuthContext);

  const fakeAmount = new BigNumber(100000000000000);

  return <ClaimXvsRewardButtonUi amountWei={fakeAmount} onClick={openAuthModal} {...props} />;
};

export default ClaimXvsRewardButton;
