import { cn } from '@venusprotocol/ui';
import { Button, Icon } from 'components';
import { PAGE_CONTAINER_ID } from 'constants/layout';

import { store } from 'containers/Layout/store';
import { forwardRef } from 'react';

const ScrollToTop = forwardRef<HTMLButtonElement>((_, ref) => {
  const isVisible = store.use.isScrollToTopVisible();
  const isCloseToBottom = store.use.isCloseToBottom();
  const scrollElem = document.getElementById(PAGE_CONTAINER_ID);

  return (
    <Button
      ref={ref}
      className={cn(
        'bg-lightGrey fixed bottom-3 right-3 h-10 w-10 rounded-full border-0 p-0 shadow transition-all lg:hidden',
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0',
        isCloseToBottom ? '-translate-y-[125%]' : 'translate-y-0',
      )}
      onClick={() => scrollElem?.scrollTo({ behavior: 'smooth', top: 0 })}
    >
      <Icon className="h-3 w-[10px]" name="arrowUpFull" />
    </Button>
  );
});

export default ScrollToTop;
