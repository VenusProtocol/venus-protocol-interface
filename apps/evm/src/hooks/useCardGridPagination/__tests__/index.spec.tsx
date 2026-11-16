import { renderHook } from 'testUtils/render';

import { useCardGridPagination } from '..';

const items = Array.from({ length: 10 }, (_, index) => index);

describe('useCardGridPagination', () => {
  it('shows two rows of cards on the first page', () => {
    const { result } = renderHook(() => useCardGridPagination({ items, columnCount: 3 }));

    expect(result.current.itemsPerPageCount).toBe(6);
    expect(result.current.pageItems).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it('shows the cards of the page set in the URL', () => {
    const { result } = renderHook(
      () => useCardGridPagination({ items, columnCount: 2, paramKey: 'vaultsPage' }),
      { routerInitialEntries: ['/?vaultsPage=3'], routePath: '/' },
    );

    expect(result.current.pageItems).toEqual([8, 9]);
  });
});
