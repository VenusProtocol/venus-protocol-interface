import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { APP_MAIN_PRODUCTION_URL } from '../constants/production';
import { AppStateConsumer, AppStateProvider } from '../context';
import s from './App.module.css';
import Banner from './Banner/Banner';
import Footer from './Footer/Footer';
import MainContent from './MainContent/MainContent';

function Main() {
  return (
    <AppStateProvider>
      <main className={s.root}>
        <AppStateConsumer>
          {({ isMobileMenuOpen }) => !isMobileMenuOpen && <Banner />}
        </AppStateConsumer>

        <MainContent />
        <Footer />
      </main>
    </AppStateProvider>
  );
}

const queryClient = new QueryClient();
const isRunningInProduction = window.location.origin === APP_MAIN_PRODUCTION_URL;

function App() {
  useEffect(() => {
    if (window.location.pathname.startsWith('/discord')) {
      window.location.replace('https://discord.com/servers/venus-protocol-912811548651708448');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {['/', '/discord'].map(path => (
            <Route path={path} element={<Main />} key={path} />
          ))}
        </Routes>
      </BrowserRouter>

      <Analytics mode={isRunningInProduction ? 'production' : 'development'} />
    </QueryClientProvider>
  );
}

export default App;
