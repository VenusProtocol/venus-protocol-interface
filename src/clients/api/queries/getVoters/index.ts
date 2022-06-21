import { restService } from 'utilities';
import { VError } from 'errors';
import formatToVoter from './formatToVoter';
import { IGetVotersInput, IGetVotersApiResponse, GetVotersOutput } from './types';

export * from './types';

const getVoters = async ({
  id,
  filter,
  limit,
  offset,
}: IGetVotersInput): Promise<GetVotersOutput> => {
  const response = await restService<IGetVotersApiResponse>({
    endpoint: `/voters/${id}`,
    method: 'GET',
    params: {
      filter,
      limit,
      offset,
    },
  });

  const payload = response.data?.data;

  // @todo Add specific api error handling
  if ('result' in response && response.result === 'error') {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { message: response.message },
    });
  }

  if (!payload) {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
  }

  return formatToVoter(payload);
};

export default getVoters;
