import { Button, Icon } from 'components';
import { PAGE_CONTAINER_ID } from 'constants/layout';
import { cn } from 'utilities';

import { store } from 'containers/Layout/store';

const ScrollToTop = () => {
  const isVisible = store.use.isScrollToTopVisible();
  const scrollElem = document.getElementById(PAGE_CONTAINER_ID);

  return (
    <Button
      className={cn(
        'bg-lightGrey fixed bottom-16 right-2 h-10 w-10 rounded-full border-0 p-0 shadow transition-opacity lg:hidden',
        isVisible ? 'opacity-1' : 'pointer-events-none opacity-0',
      )}
      onClick={() => scrollElem?.scrollTo({ behavior: 'smooth', top: 0 })}
    >
      <Icon className="h-3 w-[10px]" name="arrowUpFull" />
    </Button>
  );
};

export default ScrollToTop;
