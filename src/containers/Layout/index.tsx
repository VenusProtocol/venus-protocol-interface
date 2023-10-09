import { PAGE_CONTAINER_ID } from 'constants/layout';

import { Header } from './Header';
import { Menu } from './Menu';
import { PageContainer } from './PageContainer';

export interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="flex h-screen flex-col">
    <Menu />

    <div className="flex flex-1 flex-col overflow-auto" id={PAGE_CONTAINER_ID}>
      <Header />

      <PageContainer>{children}</PageContainer>
    </div>
  </div>
);
