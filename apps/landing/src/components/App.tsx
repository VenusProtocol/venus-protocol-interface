import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBreakpointUp } from '@venusprotocol/ui';
import { Analytics } from '@vercel/analytics/react';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LANDING_PAGE_PRODUCTION_URL } from '../constants/production';
import { AppStateConsumer, AppStateProvider } from '../context';
import s from './App.module.css';
import Banner from './Banner';
import { BerachainAd } from './BerachainAd';
import Footer from './Footer/Footer';
import MainContent from './MainContent/MainContent';

function Main() {
  // We prevent rendering the Berachain ad on mobile rather than simply hiding it using CSS to
  // prevent loading Lottie on those devices
  const isMdUp = useBreakpointUp('md');

  return (
    <AppStateProvider>
      <main className={s.root}>
        <AppStateConsumer>
          {({ isMobileMenuOpen }) => !isMobileMenuOpen && <Banner />}
        </AppStateConsumer>

        <MainContent />
        <Footer />

        {isMdUp && <BerachainAd />}
      </main>
    </AppStateProvider>
  );
}

const queryClient = new QueryClient();
const isMainProductionHost = window.location.origin === LANDING_PAGE_PRODUCTION_URL;

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

      <Analytics mode={isMainProductionHost ? 'production' : 'development'} />
    </QueryClientProvider>
  );
}

export default App;
