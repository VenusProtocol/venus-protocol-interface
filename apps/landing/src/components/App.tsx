import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PostHogProvider } from 'posthog-js/react';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import config from '../config';
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
      </PostHogProvider>
    </QueryClientProvider>
  );
}

export default App;
