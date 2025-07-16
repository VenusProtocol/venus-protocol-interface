import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import { PostHogProvider } from 'posthog-js/react';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import config from '../config';
import { LANDING_PAGE_PRODUCTION_URL } from '../constants/production';
import { version as APP_VERSION } from '../constants/version';
import { AppStateProvider } from '../context';
import s from './App.module.css';
import Footer from './Footer/Footer';
import MainContent from './MainContent/MainContent';

function Main() {
  return (
    <AppStateProvider>
      <main className={s.root}>
        <MainContent />
        <Footer />
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
      <PostHogProvider
        apiKey={config.posthog.apiKey}
        options={{
          api_host: config.posthog.hostUrl,
          persistence: 'memory',
          name: APP_VERSION,
        }}
      >
        <BrowserRouter>
          <Routes>
            {['/', '/discord'].map(path => (
              <Route path={path} element={<Main />} key={path} />
            ))}
          </Routes>
        </BrowserRouter>

        <Analytics mode={isMainProductionHost ? 'production' : 'development'} />
      </PostHogProvider>
    </QueryClientProvider>
  );
}

export default App;
