// Mock the entire backendApi module with named exports
const mockEonetApi = {
  getEvents: jest.fn(),
  getCategories: jest.fn(),
  getSources: jest.fn(),
};

const mockNeoApi = {
  getFeed: jest.fn(),
  getById: jest.fn(),
  getBrowse: jest.fn(),
};

const mockMarsRoverApi = {
  getPhotos: jest.fn(),
  getRovers: jest.fn(),
};

const mockApodApi = {
  getToday: jest.fn(),
};

jest.mock('../services/backendApi', () => ({
  eonetApi: mockEonetApi,
  neoApi: mockNeoApi,
  marsRoverApi: mockMarsRoverApi,
  apodApi: mockApodApi,
}));

import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import EarthPage from './EarthPage';

// Mock child components to isolate EarthPage logic
jest.mock('../components/Earth3D/Earth3D', () => {
  return function MockEarth3D({ events, neos, onEventClick, onNEOClick }: any) {
    return (
      <div data-testid="earth3d-mock">
        {events?.map((event: any) => (
          <button 
            key={event.id} 
            data-testid={`event-${event.id}`}
            onClick={() => onEventClick(event)}
          >
            {event.title}
          </button>
        ))}
        {neos?.map((neo: any) => (
          <button 
            key={neo.id} 
            data-testid={`neo-${neo.id}`}
            onClick={() => onNEOClick(neo)}
          >
            {neo.name}
          </button>
        ))}
      </div>
    );
  };
});

jest.mock('../components/MarsRover/MarsRoverSelector', () => () => (
  <div data-testid="marsroverselector-mock" />
));

jest.mock('../components/common/ParallaxStars', () => () => (
  <div data-testid="parallaxstars-mock" />
));

jest.mock('../components/common/SplashScreen', () => {
  return function MockSplashScreen({ onExplore }: any) {
    return (
      <button data-testid="splashscreen-mock" onClick={onExplore}>
        Explore
      </button>
    );
  };
});

jest.mock('./APODPage', () => () => (
  <div data-testid="apodpage-mock" />
));

jest.mock('../components/common/DetailsSidebar', () => {
  return function MockDetailsSidebar({ open, onClose, children }: any) {
    if (!open) return null;
    return (
      <div data-testid="details-sidebar-mock">
        <button data-testid="close-sidebar" onClick={onClose}>
          Close
        </button>
        {children}
      </div>
    );
  };
});

jest.mock('../components/common/EonetEventDetails', () => {
  return function MockEonetEventDetails({ event }: any) {
    return (
      <div data-testid="eonet-event-details-mock">
        <h3>{event?.title}</h3>
        <p>{event?.description}</p>
      </div>
    );
  };
});

jest.mock('../components/common/NeoDetails', () => {
  return function MockNeoDetails({ neo, loading, error }: any) {
    if (loading) return <div data-testid="neo-details-loading">Loading NEO details...</div>;
    if (error) return <div data-testid="neo-details-error">{error}</div>;
    if (!neo) return <div data-testid="neo-details-empty">No NEO selected</div>;
    return (
      <div data-testid="neo-details-mock">
        <h3>{neo.name}</h3>
        <p>NEO Details</p>
      </div>
    );
  };
});

jest.mock('../components/common/SectionIntroCard', () => {
  return function MockSectionIntroCard({ title, error, cardStats }: any) {
    return (
      <div data-testid={`section-introcard-mock-${title}`}>
        <h2>{title}</h2>
        {error && <div data-testid={`error-${title}`}>{error}</div>}
        {cardStats && <div data-testid={`stats-${title}`}>{cardStats}</div>}
      </div>
    );
  };
});

jest.mock('../components/common/LoadingSpinner', () => {
  return function MockLoadingSpinner({ size }: any) {
    return <div data-testid="loading-spinner-mock" data-size={size} />;
  };
});

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
});

// Mock window.scrollY
Object.defineProperty(window, 'scrollY', {
  value: 0,
  writable: true,
});

// Helper to match text content more reliably
function getCountText(label: string, count: number) {
  return (content: string, element: HTMLElement) => {
    const hasText = element.textContent?.includes(label) && element.textContent?.includes(count.toString());
    return hasText;
  };
}

describe('EarthPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set up default mock responses
    mockEonetApi.getEvents.mockResolvedValue({
      events: [
        { id: '1', title: 'Test Event 1', description: 'Test Description 1' },
        { id: '2', title: 'Test Event 2', description: 'Test Description 2' },
      ]
    });
    
    mockNeoApi.getFeed.mockResolvedValue({
      near_earth_objects: {
        '2024-01-01': [
          { id: 'neo1', name: 'Test NEO 1' },
          { id: 'neo2', name: 'Test NEO 2' },
        ]
      }
    });
    
    mockNeoApi.getById.mockResolvedValue({
      id: 'neo1',
      name: 'Test NEO Details',
      details: 'Detailed information about the NEO'
    });
  });

  describe('Initial Rendering', () => {
    it('renders all main sections and components', async () => {
      render(<EarthPage />);
      
      // Check that all main sections are rendered
      expect(screen.getByTestId('parallaxstars-mock')).toBeInTheDocument();
      expect(screen.getByTestId('splashscreen-mock')).toBeInTheDocument();
      expect(screen.getByTestId('section-introcard-mock-Real-Time Earth Events')).toBeInTheDocument();
      expect(screen.getByTestId('section-introcard-mock-Near Earth Objects')).toBeInTheDocument();
      expect(screen.getAllByTestId('earth3d-mock')).toHaveLength(2); // Two Earth3D instances
      expect(screen.getByTestId('marsroverselector-mock')).toBeInTheDocument();
      expect(screen.getByTestId('apodpage-mock')).toBeInTheDocument();
    });

    it('shows loading states initially', async () => {
      render(<EarthPage />);
      
      // Should show loading spinners initially
      expect(screen.getAllByTestId('loading-spinner-mock').length).toBeGreaterThan(0);
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner-mock')).not.toBeInTheDocument();
      });
    });

    it('displays correct event and NEO counts after loading', async () => {
      render(<EarthPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Events shown: 2')).toBeInTheDocument();
        expect(screen.getByText('Objects shown: 2')).toBeInTheDocument();
      });
    });
  });

  describe('API Integration', () => {
    it('calls EONET API on component mount', async () => {
      render(<EarthPage />);
      
      await waitFor(() => {
        expect(mockEonetApi.getEvents).toHaveBeenCalledWith({ days: 30, limit: 50 });
      });
    });

    it('calls NEO API on component mount', async () => {
      render(<EarthPage />);
      
      await waitFor(() => {
        expect(mockNeoApi.getFeed).toHaveBeenCalled();
      });
    });

    it('handles EONET API errors gracefully', async () => {
      mockEonetApi.getEvents.mockRejectedValueOnce(new Error('EONET API Error'));
      
      render(<EarthPage />);
      
      await waitFor(() => {
        expect(screen.getByTestId('error-Real-Time Earth Events')).toBeInTheDocument();
        expect(screen.getByText(/Failed to fetch Earth events/i)).toBeInTheDocument();
      });
    });

    it('handles NEO API errors gracefully', async () => {
      mockNeoApi.getFeed.mockRejectedValueOnce(new Error('NEO API Error'));
      
      render(<EarthPage />);
      
      await waitFor(() => {
        expect(screen.getByTestId('error-Near Earth Objects')).toBeInTheDocument();
        expect(screen.getByText(/Failed to fetch Near Earth Objects/i)).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    it('handles event click and opens details sidebar', async () => {
      render(<EarthPage />);
      
      // Wait for events to load
      await waitFor(() => {
        expect(screen.getByTestId('event-1')).toBeInTheDocument();
      });
      
      // Click on an event
      fireEvent.click(screen.getByTestId('event-1'));
      
      // Check that sidebar opens with event details
      await waitFor(() => {
        expect(screen.getByTestId('details-sidebar-mock')).toBeInTheDocument();
        expect(screen.getByTestId('eonet-event-details-mock')).toBeInTheDocument();
      });
    });

    it('handles NEO click and opens details sidebar', async () => {
      render(<EarthPage />);
      
      // Wait for NEOs to load
      await waitFor(() => {
        expect(screen.getByTestId('neo-neo1')).toBeInTheDocument();
      });
      
      // Click on a NEO
      fireEvent.click(screen.getByTestId('neo-neo1'));
      
      // Check that sidebar opens with NEO details
      await waitFor(() => {
        expect(screen.getByTestId('details-sidebar-mock')).toBeInTheDocument();
        expect(screen.getByTestId('neo-details-mock')).toBeInTheDocument();
      });
    });

    it('closes details sidebar when close button is clicked', async () => {
      render(<EarthPage />);
      
      // Wait for events to load
      await waitFor(() => {
        expect(screen.getByTestId('event-1')).toBeInTheDocument();
      });
      
      // First open the sidebar by clicking an event
      await waitFor(() => {
        expect(screen.getByTestId('event-1')).toBeInTheDocument();
      });
      
      fireEvent.click(screen.getByTestId('event-1'));
      
      // Check that sidebar is open
      await waitFor(() => {
        expect(screen.getByTestId('details-sidebar-mock')).toBeInTheDocument();
      });
      
      // Close the sidebar
      fireEvent.click(screen.getByTestId('close-sidebar'));
      
      // Check that sidebar is closed
      await waitFor(() => {
        expect(screen.queryByTestId('details-sidebar-mock')).not.toBeInTheDocument();
      });
    });

    it('handles splash screen explore button', async () => {
      render(<EarthPage />);
      
      const exploreButton = screen.getByTestId('splashscreen-mock');
      expect(exploreButton).toBeInTheDocument();
      
      // Click explore button
      fireEvent.click(exploreButton);
      
      // Should trigger scroll behavior (mocked)
      expect(window.scrollTo).toHaveBeenCalled();
    });
  });

  describe('State Management', () => {
    it('maintains separate loading states for events and NEOs', async () => {
      // Mock a delayed response for events
      let resolveEvents: (value: any) => void;
      const eventsPromise = new Promise((resolve) => {
        resolveEvents = resolve;
      });
      mockEonetApi.getEvents.mockReturnValueOnce(eventsPromise);
      
      render(<EarthPage />);
      
      // Should show loading spinner while waiting
      expect(screen.getAllByTestId('loading-spinner-mock').length).toBeGreaterThan(0);
      
      // Resolve the promise to finish loading
      act(() => resolveEvents({ events: [] }));
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner-mock')).not.toBeInTheDocument();
      });
    });

    it('prevents duplicate NEO API calls', async () => {
      render(<EarthPage />);
      await waitFor(() => {
        expect(mockNeoApi.getFeed).toHaveBeenCalledTimes(1);
      });
      
      // Unmount and re-mount to simulate navigation
      render(<EarthPage />);
      
      // Should not call API again due to neosLoaded state
      await waitFor(() => {
        expect(mockNeoApi.getFeed).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Error Boundaries and Edge Cases', () => {
    it('handles empty API responses', async () => {
      mockEonetApi.getEvents.mockResolvedValueOnce({ events: [] });
      mockNeoApi.getFeed.mockResolvedValueOnce({ near_earth_objects: {} });
      
      render(<EarthPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Events shown: 0')).toBeInTheDocument();
        expect(screen.getByText('Objects shown: 0')).toBeInTheDocument();
      });
    });

    it('handles malformed API responses gracefully', async () => {
      mockEonetApi.getEvents.mockResolvedValueOnce({ events: null });
      mockNeoApi.getFeed.mockResolvedValueOnce({ near_earth_objects: null });
      
      render(<EarthPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Events shown: 0')).toBeInTheDocument();
        expect(screen.getByText('Objects shown: 0')).toBeInTheDocument();
      });
    });

    it('handles network errors gracefully', async () => {
      mockEonetApi.getEvents.mockRejectedValueOnce(new Error('Network error'));
      mockNeoApi.getFeed.mockRejectedValueOnce(new Error('Network error'));
      
      render(<EarthPage />);
      
      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch Earth events/i)).toBeInTheDocument();
        expect(screen.getByText(/Failed to fetch Near Earth Objects/i)).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Design', () => {
    it('renders scroll indicators', () => {
      render(<EarthPage />);
      
      // Should render scroll indicators
      expect(screen.getAllByTestId('KeyboardArrowDownIcon')).toHaveLength(2);
    });

    it('handles mobile layout', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      render(<EarthPage />);
      
      // Should still render all components
      expect(screen.getByTestId('splashscreen-mock')).toBeInTheDocument();
      expect(screen.getByTestId('section-introcard-mock-Real-Time Earth Events')).toBeInTheDocument();
    });
  });
}); 