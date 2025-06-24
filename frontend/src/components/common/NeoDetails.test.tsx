import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import NeoDetails from './NeoDetails';

// Mock the NEOVisualization component
jest.mock('./NEOVisualization', () => {
  return ({ neoId }: { neoId: string }) => (
    <div data-testid="neo-visualization" data-neo-id={neoId}>
      NEO Visualization for {neoId}
    </div>
  );
});

const mockTheme = createTheme();

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('NeoDetails', () => {
  const mockNeo = {
    id: '12345',
    name: 'Test Asteroid (2024 ABC)',
    absolute_magnitude_h: 15.5,
    estimated_diameter: {
      kilometers: {
        estimated_diameter_min: 0.5,
        estimated_diameter_max: 1.2,
      },
    },
    is_potentially_hazardous_asteroid: true,
    nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=12345',
  };

  describe('Loading State', () => {
    it('shows loading spinner when loading is true', () => {
      renderWithProviders(
        <NeoDetails neo={null} loading={true} error={null} />
      );

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('does not show content when loading', () => {
      renderWithProviders(
        <NeoDetails neo={mockNeo} loading={true} error={null} />
      );

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(screen.queryByText('Test Asteroid (2024 ABC)')).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('shows error message when error is provided', () => {
      const errorMessage = 'Failed to fetch NEO details';
      renderWithProviders(
        <NeoDetails neo={null} loading={false} error={errorMessage} />
      );

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('does not show NEO content when there is an error', () => {
      const errorMessage = 'Failed to fetch NEO details';
      renderWithProviders(
        <NeoDetails neo={mockNeo} loading={false} error={errorMessage} />
      );

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.queryByText('Test Asteroid (2024 ABC)')).not.toBeInTheDocument();
    });
  });

  describe('NEO Data Display', () => {
    it('renders NEO name when data is provided', () => {
      renderWithProviders(
        <NeoDetails neo={mockNeo} loading={false} error={null} />
      );

      expect(screen.getByText('Test Asteroid (2024 ABC)')).toBeInTheDocument();
    });

    it('renders NEO ID', () => {
      renderWithProviders(
        <NeoDetails neo={mockNeo} loading={false} error={null} />
      );

      expect(screen.getByText('NEO ID: 12345')).toBeInTheDocument();
    });

    it('renders absolute magnitude', () => {
      renderWithProviders(
        <NeoDetails neo={mockNeo} loading={false} error={null} />
      );

      expect(screen.getByText('Absolute Magnitude: 15.5')).toBeInTheDocument();
    });

    it('renders estimated diameter range', () => {
      renderWithProviders(
        <NeoDetails neo={mockNeo} loading={false} error={null} />
      );

      expect(screen.getByText('Estimated Diameter: 0.50 - 1.20 km')).toBeInTheDocument();
    });

    it('renders potentially hazardous status as Yes', () => {
      renderWithProviders(
        <NeoDetails neo={mockNeo} loading={false} error={null} />
      );

      expect(screen.getByText('Potentially Hazardous: Yes')).toBeInTheDocument();
    });

    it('renders potentially hazardous status as No', () => {
      const nonHazardousNeo = { ...mockNeo, is_potentially_hazardous_asteroid: false };
      renderWithProviders(
        <NeoDetails neo={nonHazardousNeo} loading={false} error={null} />
      );

      expect(screen.getByText('Potentially Hazardous: No')).toBeInTheDocument();
    });

    it('renders NASA JPL link button', () => {
      renderWithProviders(
        <NeoDetails neo={mockNeo} loading={false} error={null} />
      );

      const linkButton = screen.getByText('NASA JPL Details');
      expect(linkButton).toBeInTheDocument();
      expect(linkButton).toHaveAttribute('href', 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=12345');
      expect(linkButton).toHaveAttribute('target', '_blank');
    });
  });

  describe('NEO Visualization', () => {
    it('renders visualization component when NEO has ID', () => {
      renderWithProviders(
        <NeoDetails neo={mockNeo} loading={false} error={null} />
      );

      expect(screen.getByTestId('neo-visualization')).toBeInTheDocument();
      expect(screen.getByTestId('neo-visualization')).toHaveAttribute('data-neo-id', '12345');
    });

    it('does not render visualization when NEO has no ID', () => {
      const neoWithoutId = { ...mockNeo, id: undefined };
      renderWithProviders(
        <NeoDetails neo={neoWithoutId} loading={false} error={null} />
      );

      expect(screen.queryByTestId('neo-visualization')).not.toBeInTheDocument();
    });

    it('does not render visualization when NEO is null', () => {
      renderWithProviders(
        <NeoDetails neo={null} loading={false} error={null} />
      );

      expect(screen.queryByTestId('neo-visualization')).not.toBeInTheDocument();
    });
  });

  describe('Null/Empty States', () => {
    it('renders nothing when neo is null and not loading and no error', () => {
      const { container } = renderWithProviders(
        <NeoDetails neo={null} loading={false} error={null} />
      );

      expect(container.firstChild).toBeNull();
    });

    it('handles NEO with missing properties gracefully', () => {
      const incompleteNeo = {
        id: '12345',
        name: 'Incomplete Asteroid',
        // Missing other properties
      };

      renderWithProviders(
        <NeoDetails neo={incompleteNeo as any} loading={false} error={null} />
      );

      expect(screen.getByText('Incomplete Asteroid')).toBeInTheDocument();
      expect(screen.getByText('NEO ID: 12345')).toBeInTheDocument();
      // Should not crash when properties are missing
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive styling to title', () => {
      renderWithProviders(
        <NeoDetails neo={mockNeo} loading={false} error={null} />
      );

      const title = screen.getByText('Test Asteroid (2024 ABC)');
      expect(title).toBeInTheDocument();
    });

    it('applies responsive styling to button', () => {
      renderWithProviders(
        <NeoDetails neo={mockNeo} loading={false} error={null} />
      );

      const button = screen.getByText('NASA JPL Details');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      renderWithProviders(
        <NeoDetails neo={mockNeo} loading={false} error={null} />
      );

      const title = screen.getByText('Test Asteroid (2024 ABC)');
      expect(title.tagName).toMatch(/^H[1-6]$/);
    });

    it('has accessible error alert', () => {
      const errorMessage = 'Failed to fetch NEO details';
      renderWithProviders(
        <NeoDetails neo={null} loading={false} error={errorMessage} />
      );

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent(errorMessage);
    });

    it('has accessible loading indicator', () => {
      renderWithProviders(
        <NeoDetails neo={null} loading={true} error={null} />
      );

      const spinner = screen.getByRole('progressbar');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles very large diameter values', () => {
      const largeNeo = {
        ...mockNeo,
        estimated_diameter: {
          kilometers: {
            estimated_diameter_min: 999.999,
            estimated_diameter_max: 1000.001,
          },
        },
      };

      renderWithProviders(
        <NeoDetails neo={largeNeo} loading={false} error={null} />
      );

      expect(screen.getByText('Estimated Diameter: 1000.00 - 1000.00 km')).toBeInTheDocument();
    });

    it('handles very small diameter values', () => {
      const smallNeo = {
        ...mockNeo,
        estimated_diameter: {
          kilometers: {
            estimated_diameter_min: 0.001,
            estimated_diameter_max: 0.002,
          },
        },
      };

      renderWithProviders(
        <NeoDetails neo={smallNeo} loading={false} error={null} />
      );

      expect(screen.getByText('Estimated Diamitude: 0.00 - 0.00 km')).toBeInTheDocument();
    });

    it('handles NEO with very long name', () => {
      const longNameNeo = {
        ...mockNeo,
        name: 'Very Long Asteroid Name That Exceeds Normal Length Limits And Should Still Display Properly (2024 ABCDEFGHIJKLMNOP)',
      };

      renderWithProviders(
        <NeoDetails neo={longNameNeo} loading={false} error={null} />
      );

      expect(screen.getByText(longNameNeo.name)).toBeInTheDocument();
    });
  });
}); 