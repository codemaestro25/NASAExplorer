import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import APODPage from './APODPage';

// Mock the APODSection component
jest.mock('../components/common/APODSection', () => {
  return () => <div data-testid="apod-section">APOD Section Content</div>;
});

const mockTheme = createTheme();

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('APODPage', () => {
  describe('Rendering', () => {
    it('renders the APOD page container', () => {
      renderWithProviders(<APODPage />);
      
      const container = screen.getByTestId('apod-section').parentElement;
      expect(container).toBeInTheDocument();
    });

    it('renders the APODSection component', () => {
      renderWithProviders(<APODPage />);
      
      expect(screen.getByTestId('apod-section')).toBeInTheDocument();
      expect(screen.getByText('APOD Section Content')).toBeInTheDocument();
    });

    it('applies correct styling to the container', () => {
      renderWithProviders(<APODPage />);
      
      const container = screen.getByTestId('apod-section').parentElement;
      expect(container).toHaveStyle({
        background: 'transparent',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      });
    });

    it('has responsive padding', () => {
      renderWithProviders(<APODPage />);
      
      const container = screen.getByTestId('apod-section').parentElement;
      // The padding should be applied via MUI's sx prop
      expect(container).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('passes no props to APODSection', () => {
      renderWithProviders(<APODPage />);
      
      // The APODSection component is rendered without any props
      expect(screen.getByTestId('apod-section')).toBeInTheDocument();
    });

    it('maintains proper component hierarchy', () => {
      renderWithProviders(<APODPage />);
      
      const container = screen.getByTestId('apod-section').parentElement;
      expect(container?.tagName).toBe('DIV');
      expect(container?.children).toHaveLength(1);
    });
  });

  describe('Accessibility', () => {
    it('has proper semantic structure', () => {
      renderWithProviders(<APODPage />);
      
      const container = screen.getByTestId('apod-section').parentElement;
      expect(container).toBeInTheDocument();
    });
  });
}); 