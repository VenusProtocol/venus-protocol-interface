import { Outlet } from 'react-router';
import Footer from './Footer/Footer';
import Header from './Header/Header';

export const Layout: React.FC = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);
