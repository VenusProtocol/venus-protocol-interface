import { renderHook } from '@testing-library/react';

import { useVisibleCardsMaxHeight } from '..';

const createCardList = (cardHeights: number[]) => {
  const cardList = document.createElement('div');
  let offsetTop = 0;

  for (const cardHeight of cardHeights) {
    const card = document.createElement('div');
    Object.defineProperty(card, 'offsetTop', { value: offsetTop });
    Object.defineProperty(card, 'offsetHeight', { value: cardHeight });
    cardList.appendChild(card);
    offsetTop += cardHeight + 24;
  }

  return cardList;
};

describe('useVisibleCardsMaxHeight', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe = vi.fn();
        disconnect = vi.fn();
      },
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fits the list to the bottom of the last visible card, whatever the card heights', () => {
    const cardHeights = [276, 276, 255, 255, 255, 255, 255];
    const cardListRef = { current: createCardList(cardHeights) };

    const { result } = renderHook(() =>
      useVisibleCardsMaxHeight({
        cardListRef,
        cards: cardHeights,
        maxVisibleCardCount: 5,
      }),
    );

    expect(result.current).toBe(276 * 2 + 255 * 3 + 24 * 4);
  });

  it.each([3, 5])('does not limit the height of a list of %i cards', cardCount => {
    const cardHeights = Array.from({ length: cardCount }, () => 276);
    const cardListRef = { current: createCardList(cardHeights) };

    const { result } = renderHook(() =>
      useVisibleCardsMaxHeight({
        cardListRef,
        cards: cardHeights,
        maxVisibleCardCount: 5,
      }),
    );

    expect(result.current).toBeUndefined();
  });

  it('does not limit the height of a hidden list', () => {
    const cardHeights = Array.from({ length: 7 }, () => 0);
    const cardListRef = { current: createCardList(cardHeights) };

    const { result } = renderHook(() =>
      useVisibleCardsMaxHeight({
        cardListRef,
        cards: cardHeights,
        maxVisibleCardCount: 5,
      }),
    );

    expect(result.current).toBeUndefined();
  });
});
