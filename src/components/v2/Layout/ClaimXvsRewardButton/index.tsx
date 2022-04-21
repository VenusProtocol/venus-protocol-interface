/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';

import toast from 'components/Basic/Toast';
import { AuthContext } from 'context/AuthContext';
import { useGetXvsReward, useClaimXvsReward } from 'clients/api';
import { useTranslation } from 'translation';
import { convertWeiToCoins } from 'utilities/common';
import { Icon } from '../../Icon';
import { SecondaryButton, IButtonProps } from '../../Button';
import { useStyles } from './styles';

const XVS_SYMBOL = 'xvs';

export const TEST_ID = 'claim-xvs-reward-button';

export interface IClaimXvsRewardButton extends IButtonProps {
  amountWei?: BigNumber;
}

export const ClaimXvsRewardButtonUi: React.FC<IClaimXvsRewardButton> = ({
  amountWei,
  ...otherProps
}) => {
  const { Trans } = useTranslation();
  const styles = useStyles();

  if (!amountWei || amountWei.isEqualTo(0)) {
    return null;
  }

  const readableAmount = convertWeiToCoins({
    value: amountWei,
    tokenSymbol: XVS_SYMBOL,
    returnInReadableFormat: true,
  });

  return (
    <SecondaryButton data-testid={TEST_ID} css={styles.button} {...otherProps}>
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
  const { t } = useTranslation();

  const { mutate: claimXvsReward, isLoading: isClaimXvsRewardLoading } = useClaimXvsReward({
    onError: error => {
      toast.error({
        title: error.message,
      });
    },
    onSuccess: () => {
      // @TODO: display success modal instead of toast once it's been
      // implemented (see https://app.clickup.com/t/2849k4u)
      toast.success({
        title: t('claimXvsRewardButton.successMessage'),
      });
    },
  });

  const handleClick = () => {
    if (account?.address) {
      claimXvsReward({
        fromAccountAddress: account.address,
      });
    }
  };

  return (
    <ClaimXvsRewardButtonUi
      amountWei={xvsRewardWei}
      loading={isClaimXvsRewardLoading}
      onClick={handleClick}
      {...props}
    />
  );
};

export default ClaimXvsRewardButton;
