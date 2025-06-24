import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import spaceTheme from './styles/theme';

const EarthPage = React.lazy(() => import('./pages/EarthPage'));

const MarsRoverDetailPage = React.lazy(() => import('./pages/MarsRoverDetailPage'));

function App() {


  return (
    <ThemeProvider theme={spaceTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<EarthPage />} />

          <Route path="/mars/:roverId" element={<MarsRoverDetailPage />} />
        </Routes>
      </Router>

    </ThemeProvider>
  );
}

export default App;
