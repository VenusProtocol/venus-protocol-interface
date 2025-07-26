import { Outlet } from 'react-router';

import { PAGE_CONTAINER_ID } from 'constants/layout';

import { useRef } from 'react';
import { Footer } from './Footer';
import { Header } from './Header';
import ScrollToTop from './ScrollToTop';
import { Sidebar } from './Sidebar';
import { TestEnvWarning } from './TestEnvWarning';
import { store } from './store';

export const Layout: React.FC = () => {
  const scrollToTopRef = useRef<HTMLButtonElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

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
    // 1.25 is not arbitrary, it's related to the styling of ScrollToTop
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

  return (
    <div className="h-dvh flex flex-col">
      <TestEnvWarning />

      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        <Sidebar />

        <div
          className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto"
          id={PAGE_CONTAINER_ID}
          onScroll={handleScroll}
        >
          <Header />

          <main className="relative w-full shrink-0 grow px-4 pb-4 md:px-6 xl:mx-auto xl:max-w-[1360px] xl:px-10">
            <Outlet />
            <ScrollToTop ref={scrollToTopRef} />
          </main>

          <Footer ref={footerRef} />
        </div>
      </div>
    </div>
  );
};
