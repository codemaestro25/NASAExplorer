import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import spaceTheme from './styles/theme';
import EarthPage from './pages/EarthPage';
import NEOPage from './pages/NEOPage';
import MarsRoverPage from './pages/MarsRoverPage';
import MarsRoverDetailPage from './pages/MarsRoverDetailPage';

function App() {
  return (
    <ThemeProvider theme={spaceTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<EarthPage />} />
          <Route path="/neo" element={<NEOPage />} />
          <Route path="/mars" element={<MarsRoverPage />} />
          <Route path="/mars/:roverId" element={<MarsRoverDetailPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
