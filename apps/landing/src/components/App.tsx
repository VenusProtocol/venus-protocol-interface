import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { DISCORD_SERVER_URL } from '../constants/production';
import { AppStateProvider } from '../context';
import { AnalyticProvider } from './AnalyticProvider';
import s from './App.module.css';
import Footer from './Footer/Footer';
import MainContent from './MainContent/MainContent';

function Main() {
  return (
    <main className={s.root}>
      <MainContent />
      <Footer />
    </main>
  );
}

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    if (window.location.pathname.startsWith('/discord')) {
      window.location.replace(DISCORD_SERVER_URL);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppStateProvider>
        <AnalyticProvider>
          <BrowserRouter>
            <Routes>
              {['/', '/discord'].map(path => (
                <Route path={path} element={<Main />} key={path} />
              ))}
            </Routes>
          </BrowserRouter>
        </AnalyticProvider>
      </AppStateProvider>
    </QueryClientProvider>
  );
}

export default App;
