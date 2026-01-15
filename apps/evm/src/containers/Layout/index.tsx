import { Outlet, matchPath, useLocation } from 'react-router';

import { PAGE_CONTAINER_ID } from 'constants/layout';

import { Wrapper, cn } from 'components';
import { Subdirectory } from 'constants/routing';
import { useRef } from 'react';
import { Footer } from './Footer';
import { Header } from './Header';
import { NavBar } from './NavBar';
import ScrollToTop from './ScrollToTop';
import { TestEnvWarning } from './TestEnvWarning';
import { store } from './store';

const NO_WRAPPER_PATHNAMES = [Subdirectory.LANDING] as string[];

export const Layout: React.FC = () => {
  const scrollToTopRef = useRef<HTMLButtonElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const { pathname } = useLocation();

  const isCloseToBottomState = store.use.isCloseToBottom();
  const setIsCloseToBottom = store.use.setIsCloseToBottom();
  const setScrollToTopVisible = store.use.setScrollToTopVisible();
  const isScrollToTopVisible = store.use.isScrollToTopVisible();
  const viewportHeight = window.innerHeight;

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const scrollElem = event.currentTarget;
    const shouldShowScrollToTopVisible =
      scrollElem?.scrollTop && scrollElem.scrollTop > viewportHeight;

    const scrollToTopRect = scrollToTopRef.current?.getBoundingClientRect();
    const footerRect = footerRef.current?.getBoundingClientRect();
    const footerTopPos = footerRect ? footerRect.top - footerRect.height : undefined;

    // if the state is already flagged, it means we the scroll pos has already gone up
    // which in turn will make the bottom position move up
    // causing the next values of `isCloseToBottom` to switch between true and false until they settle
    // we treat this case by calculating a reference position
    const scrollBtnBottom = scrollToTopRect?.bottom ?? 0;
    const scrollBtnHeight = scrollToTopRect?.height ?? 0;
    // 1.25 is not arbitrary, it's related to the the styling of ScrollToTop
    // it's currently moving up by 125% of its height
    const scrollBtnDisplacement = isCloseToBottomState ? scrollBtnHeight * 1.25 : 0;
    const actualBottomReference = scrollBtnBottom + scrollBtnDisplacement;
    const isCloseToBottom = footerTopPos ? actualBottomReference >= footerTopPos : false;

    if (isCloseToBottomState !== isCloseToBottom) {
      setIsCloseToBottom(isCloseToBottom);
    }

    if (shouldShowScrollToTopVisible && !isScrollToTopVisible) {
      setScrollToTopVisible(true);
    } else if (!shouldShowScrollToTopVisible && isScrollToTopVisible) {
      setScrollToTopVisible(false);
    }
  };

  const noWrapper = NO_WRAPPER_PATHNAMES.some(noWrapperPath => matchPath(noWrapperPath, pathname));

  return (
    <div className="h-dvh flex flex-col">
      <NavBar className="shrink-0" />

      <div
        className={cn(
          'flex flex-col grow gap-y-10  overflow-x-hidden ',
          noWrapper ? '' : 'pt-5 sm:pt-10',
        )}
        id={PAGE_CONTAINER_ID}
        onScroll={handleScroll}
      >
        <TestEnvWarning className="shrink-0 -mt-10" />

        <Header />

        {noWrapper ? (
          <>
            <Outlet />
            <ScrollToTop ref={scrollToTopRef} />
          </>
        ) : (
          <Wrapper className="relative w-full shrink-0 grow">
            <Outlet />
            <ScrollToTop ref={scrollToTopRef} />
          </Wrapper>
        )}

        <Footer ref={footerRef} />
      </div>
    </div>
  );
};
