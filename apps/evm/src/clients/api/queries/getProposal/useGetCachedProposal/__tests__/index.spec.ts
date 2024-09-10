import { QueryClient } from '@tanstack/react-query';
import { proposals as fakeProposals } from '__mocks__/models/proposals';
import FunctionKey from 'constants/functionKey';
import { renderHook } from 'testUtils/render';
import { useGetCachedProposal } from '..';

describe('useGetCachedProposal', () => {
  it('returns proposal from cache when it exists', async () => {
    const fakeQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });

    fakeQueryClient.getQueriesData = () => [
      [
        [FunctionKey.GET_PROPOSALS],
        {
          proposals: fakeProposals,
        } as any,
      ],
    ];

    const { result } = renderHook(
      () =>
        useGetCachedProposal({
          proposalId: fakeProposals[0].proposalId,
        }),
      {
        queryClient: fakeQueryClient,
      },
    );

    expect(result.current).toMatchSnapshot();
  });

  it('returns undefined if proposal does not exist in cache', async () => {
    const { result } = renderHook(() =>
      useGetCachedProposal({
        proposalId: 0,
      }),
    );

    expect(result.current).toBe(undefined);
  });
});
