import { Outlet } from 'react-router';
import Footer from './Footer/Footer';
import Header from './Header/Header';

export const Layout: React.FC = () => (
  <>
    <Header />

    <main className="w-full max-w-[1280px] mx-auto">
      <Outlet />
    </main>

    <Footer />
  </>
);
