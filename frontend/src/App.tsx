import React, { useState, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import spaceTheme from './styles/theme';
import CentralErrorPage from './components/common/CentralErrorPage';

const EarthPage = React.lazy(() => import('./pages/EarthPage'));
const MarsRoverDetailPage = React.lazy(() => import('./pages/MarsRoverDetailPage'));

function App() {
  const [backendDown, setBackendDown] = useState(false);

  // Global fetch/axios error handler (example for axios)
  React.useEffect(() => {
    const handleError = (error: any) => {
      // Detect network error or 5xx
      if (
        error?.message === 'Network Error' ||
        (error?.response && error.response.status >= 500)
      ) {
        setBackendDown(true);
      }
      return Promise.reject(error);
    };
    // Dynamically import axios to avoid SSR issues
    import('axios').then(({ default: axios }) => {
      const interceptor = axios.interceptors.response.use(
        (response) => response,
        handleError
      );
      return () => axios.interceptors.response.eject(interceptor);
    });
  }, []);

  if (backendDown) {
    return <CentralErrorPage onRetry={() => window.location.reload()} />;
  }

  return (
    <ThemeProvider theme={spaceTheme}>
      <CssBaseline />
      <Router>
        <Suspense fallback={<div />}> {/* You can use a spinner here */}
          <Routes>
            <Route path="/" element={<EarthPage />} />
            <Route path="/mars/:roverId" element={<MarsRoverDetailPage />} />
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
