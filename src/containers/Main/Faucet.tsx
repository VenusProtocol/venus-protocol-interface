import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useRequestFaucetFunds } from 'clients/api';
import toast from 'components/Basic/Toast';
import { getToken } from 'utilities';
import Faucet from 'components/Faucet';

type IFaucetContainerProps = RouteComponentProps;

const FaucetContainer: React.FC<IFaucetContainerProps> = () => {
  const { mutate: requestFaucetFunds, isLoading: isRequestFaucetFundsLoading } =
    useRequestFaucetFunds({
      onSuccess: (_data, variables) => {
        let fromAddress;
        if (variables.asset === 'xvs' || variables.asset === 'bnb') {
          fromAddress = getToken('xvs').address;
        } else {
          fromAddress = getToken(variables.asset).address;
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
