import { restService } from 'utilities';

export type GetIsAddressAuthorizedOutput = {
  authorized: boolean;
};

const getIsAddressAuthorized = async ({
  accountAddress,
}: {
  accountAddress: string;
}): Promise<GetIsAddressAuthorizedOutput> => {
  if (accountAddress) {
    const response = await restService({
      endpoint: `/authentication/${accountAddress}`,
      method: 'GET',
      next: true,
    });

    const authorized = response.status !== 403;

    return {
      authorized,
    };
  }

  return {
    authorized: false,
  };
};

export default getIsAddressAuthorized;
