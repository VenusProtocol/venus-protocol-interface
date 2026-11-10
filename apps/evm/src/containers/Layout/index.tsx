import { Outlet, matchPath, useLocation } from 'react-router';

import { BODY_PORTAL_ID, PAGE_CONTAINER_ID } from 'constants/layout';

import { SectionErrorBoundary, Wrapper, cn } from 'components';
import { Subdirectory, routes } from 'constants/routing';
import { usePointerLight } from 'hooks/usePointerLight';
import { useWindowFocusFlag } from 'hooks/useWindowFocusFlag';
import { useRef, useState } from 'react';
import { Footer } from './Footer';
import { Header } from './Header';
import { InterfaceOnboarding } from './InterfaceOnboarding';
import { NavBar } from './NavBar';
import ScrollToTop from './ScrollToTop';
import { Starfield } from './Starfield';
import { TestEnvWarning } from './TestEnvWarning';
import { useStore } from './store';

const NO_WRAPPER_PATHNAMES = [Subdirectory.LANDING, routes.markets.path] as string[];

export const Layout: React.FC = () => {
  const scrollToTopRef = useRef<HTMLButtonElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const { pathname } = useLocation();
  const [isPageScrolled, setIsPageScrolled] = useState(false);

  usePointerLight();
  useWindowFocusFlag();

  const isCloseToBottomState = useStore(state => state.isCloseToBottom);
  const setIsCloseToBottom = useStore(state => state.setIsCloseToBottom);
  const setScrollToTopVisible = useStore(state => state.setScrollToTopVisible);
  const isScrollToTopVisible = useStore(state => state.isScrollToTopVisible);
  const viewportHeight = window.innerHeight;

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const scrollElem = event.currentTarget;
    setIsPageScrolled(scrollElem.scrollTop > 0);
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
  const contentDom = (
    <>
      <SectionErrorBoundary className="my-20">
        <Outlet />
      </SectionErrorBoundary>

      <ScrollToTop ref={scrollToTopRef} />
    </>
  );

  const WrapperComp = noWrapper ? 'div' : Wrapper;

  return (
    <>
      <div className="h-dvh flex flex-col bg-canvas">
        <Starfield />

        <div className="relative flex min-h-0 grow flex-col">
          <NavBar
            className={cn(
              'absolute inset-x-0 top-0 z-10000 shrink-0 bg-transparent before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:transition-colors',
              isPageScrolled && 'before:bg-canvas/20 before:backdrop-blur-xs',
            )}
          />

          <div
            className="relative flex grow scroll-pt-20 flex-col overflow-x-hidden pt-20"
            id={PAGE_CONTAINER_ID}
            onScroll={handleScroll}
          >
            <TestEnvWarning className="relative shrink-0" />

            <Header />

            <div className="relative flex grow flex-col">
              <WrapperComp
                className={cn('relative w-full shrink-0 grow', !noWrapper && 'pt-5 sm:pt-10')}
              >
                {contentDom}
              </WrapperComp>

              <Footer ref={footerRef} />
            </div>
          </div>
        </div>

        <div id={BODY_PORTAL_ID} />

        <InterfaceOnboarding />
      </div>
    </>
  );
};
