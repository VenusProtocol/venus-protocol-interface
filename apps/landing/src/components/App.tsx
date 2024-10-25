import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
    </QueryClientProvider>
  );
}

export default App;
