import { ButtonWrapper, Icon } from 'components';
import { cn } from 'utilities';

import { PAGE_CONTAINER_ID } from 'constants/layout';

import { store } from '../store';

const ScrollToTop = () => {
  const isVisible = store.use.isScrollToTopVisible();
  const scrollElem = document.getElementById(PAGE_CONTAINER_ID);

  return (
    <ButtonWrapper
      className={cn(
        'shadow-[0px 4px 15px 0px #0D1017] fixed bottom-16 right-2 h-10 w-10 rounded-full border-0 bg-lightGrey p-0 transition-opacity lg:hidden',
        isVisible ? 'opacity-1' : 'pointer-events-none opacity-0',
      )}
      onClick={() => scrollElem?.scrollTo({ behavior: 'smooth', top: 0 })}
    >
      <Icon className="h-3 w-[10px]" name="arrowUpFull" />
    </ButtonWrapper>
  );
};

export default ScrollToTop;
