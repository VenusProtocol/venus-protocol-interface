import { PAGE_CONTAINER_ID } from 'constants/layout';

import { Footer } from './Footer';
import { Header } from './Header';
import { Menu } from './Menu';
import ScrollToTop from './ScrollToTop';
import { store } from './store';

export interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const setScrollToTopVisible = store.use.setScrollToTopVisible();
  const isScrollToTopVisible = store.use.isScrollToTopVisible();
  const viewportHeight = window.innerHeight;
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const scrollElem = event.currentTarget;
    const shouldShowScrollToTopVisible =
      scrollElem?.scrollTop && scrollElem.scrollTop > viewportHeight;

    if (shouldShowScrollToTopVisible && !isScrollToTopVisible) {
      setScrollToTopVisible(true);
    } else if (!shouldShowScrollToTopVisible && isScrollToTopVisible) {
      setScrollToTopVisible(false);
    }
  };

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <Menu />

      <div
        className="flex flex-1 flex-col overflow-y-auto"
        id={PAGE_CONTAINER_ID}
        onScroll={handleScroll}
      >
        <Header />

        <main className="w-full shrink-0 grow px-4 pb-4 md:px-6 xl:mx-auto xl:max-w-[1360px] xl:px-10">
          {children}
        </main>

        <ScrollToTop />

        <Footer />
      </div>
    </div>
  );
};
