import { PAGE_CONTAINER_ID } from 'constants/layout';

import { Footer } from './Footer';
import { Header } from './Header';
import { Menu } from './Menu';

export interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="flex h-screen flex-col md:flex-row">
    <Menu />

    <div className="flex flex-1 flex-col overflow-y-auto" id={PAGE_CONTAINER_ID}>
      <Header />

      <main className="flex-1 px-4 pb-4 md:px-6 xl:mx-auto xl:max-w-[1360px] xl:px-10">
        {children}
      </main>

      <Footer />
    </div>
  </div>
);
