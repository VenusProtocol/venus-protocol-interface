import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import useRequestFaucetFunds from 'hooks/useRequestFaucetFunds';
import toast from 'components/Basic/Toast';
import * as constants from 'constants/contracts';
import Faucet from 'components/Faucet';

type IFaucetContainerProps = RouteComponentProps;

const FaucetContainer: React.FC<IFaucetContainerProps> = () => {
  const { mutate: requestFaucetFunds, isLoading: isRequestFaucetFundsLoading } =
    useRequestFaucetFunds({
      onSuccess: (_data, variables) => {
        let fromAddress;
        if (variables.asset === 'xvs') {
          fromAddress = constants.XVS_TOKEN;
        } else if (variables.asset === 'bnb') {
          fromAddress = constants.XVS_TOKEN;
        } else {
          fromAddress = constants.getToken(variables.asset).address;
        }

        toast.success({
          title: `Funding request for ${fromAddress} into ${variables.address}`,
        });
      },
      onError: error => {
        toast.error({
          title: error.message,
        });
      },
    });

  return (
    <Faucet
      requestFaucetFunds={requestFaucetFunds}
      isRequestFaucetFundsLoading={isRequestFaucetFundsLoading}
    />
  );
};

export default withRouter(FaucetContainer);
