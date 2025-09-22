import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnalyticProvider } from 'components/AnalyticProvider';
import { Layout } from 'components/Layout';
import { DISCORD_SERVER_URL } from 'constants/production';
import { AppStateProvider } from 'context';
import { Home } from 'pages/Home';
import { PrivacyPolicy } from 'pages/PrivacyPolicy';
import { TermsOfUse } from 'pages/TermsOfUse';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';

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
              <Route element={<Layout />}>
                {['/', '/discord'].map(path => (
                  <Route path={path} element={<Home />} key={path} />
                ))}

                <Route path="/privacy-policy" element={<PrivacyPolicy />} />

                <Route path="/terms-of-use" element={<TermsOfUse />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AnalyticProvider>
      </AppStateProvider>
    </QueryClientProvider>
  );
}

export default App;
