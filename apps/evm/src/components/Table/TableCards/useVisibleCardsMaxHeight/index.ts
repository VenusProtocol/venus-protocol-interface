import { type RefObject, useEffect, useState } from 'react';

export interface UseVisibleCardsMaxHeightInput {
  cardListRef: RefObject<HTMLDivElement | null>;
  cards: unknown[];
  maxVisibleCardCount?: number;
}

export const useVisibleCardsMaxHeight = ({
  cardListRef,
  cards,
  maxVisibleCardCount,
}: UseVisibleCardsMaxHeightInput) => {
  const [maxHeight, setMaxHeight] = useState<number>();

  useEffect(() => {
    const cardList = cardListRef.current;

    if (!cardList || !maxVisibleCardCount || cards.length <= maxVisibleCardCount) {
      setMaxHeight(undefined);
      return;
    }

    const updateMaxHeight = () => {
      const lastVisibleCard = cardList.children[maxVisibleCardCount - 1];

      if (!(lastVisibleCard instanceof HTMLElement) || lastVisibleCard.offsetHeight === 0) {
        setMaxHeight(undefined);
        return;
      }

      setMaxHeight(lastVisibleCard.offsetTop + lastVisibleCard.offsetHeight);
    };

    updateMaxHeight();

    const resizeObserver = new ResizeObserver(updateMaxHeight);
    for (const card of cardList.children) {
      resizeObserver.observe(card);
    }

    return () => resizeObserver.disconnect();
  }, [cardListRef, cards, maxVisibleCardCount]);

  return maxHeight;
};
