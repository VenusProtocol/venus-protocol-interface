import Header from './Header';
import { PageContainer } from './PageContainer';
import Sidebar from './Sidebar';

export interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="flex h-screen flex-col lg:flex-row">
    <Sidebar />

    <div className="flex flex-1 flex-col">
      <Header />

      <PageContainer>{children}</PageContainer>
    </div>
  </div>
);
