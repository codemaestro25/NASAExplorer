import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MarsRoverDetailPage from './MarsRoverDetailPage';
import { marsRoverApi } from '../services/backendApi';

// Mock the API
jest.mock('../services/backendApi', () => ({
  marsRoverApi: {
    getPhotos: jest.fn(),
  },
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ roverId: 'curiosity' }),
}));

// Mock @react-three/fiber and @react-three/drei
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas">{children}</div>,
}));

jest.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  useGLTF: () => ({ scene: {} }),
}));

// Mock the PhotoModal component
jest.mock('../components/common/PhotoModal', () => {
  return React.forwardRef(({ photos }: { photos: any[] }, ref: any) => (
    <div data-testid="photo-modal" ref={ref}>
      Photo Modal ({photos.length} photos)
    </div>
  ));
});

// Mock the Layout component
jest.mock('../components/common/Layout', () => {
  return ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div data-testid="layout" title={title}>
      {children}
    </div>
  );
});

const mockTheme = createTheme();

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={mockTheme}>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('MarsRoverDetailPage', () => {
  const mockManifest = {
    name: 'Curiosity',
    status: 'active',
    total_photos: 500000,
    launch_date: '2011-11-26',
    landing_date: '2012-08-06',
    max_date: '2024-01-15',
    max_sol: 4000,
  };

  const mockPhotos = [
    {
      id: 1,
      img_src: 'https://example.com/photo1.jpg',
      camera: { full_name: 'Front Hazard Avoidance Camera' },
      earth_date: '2024-01-15',
    },
    {
      id: 2,
      img_src: 'https://example.com/photo2.jpg',
      camera: { full_name: 'Mast Camera' },
      earth_date: '2024-01-15',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (marsRoverApi.getPhotos as jest.Mock).mockResolvedValue({
      photo_manifest: mockManifest,
      photos: mockPhotos,
    });
  });

  describe('Rendering', () => {
    it('renders the page with correct title', () => {
      renderWithProviders(<MarsRoverDetailPage />);
      
      expect(screen.getByTestId('layout')).toHaveAttribute('title', 'Mars Rover: Curiosity');
    });

    it('renders mission manifest section', () => {
      renderWithProviders(<MarsRoverDetailPage />);
      
      expect(screen.getByText('Mission Manifest')).toBeInTheDocument();
    });

    it('renders 3D model canvas', () => {
      renderWithProviders(<MarsRoverDetailPage />);
      
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('renders photo gallery section', () => {
      renderWithProviders(<MarsRoverDetailPage />);
      
      expect(screen.getByText('Grab photos of the rover from a particular date and camera')).toBeInTheDocument();
    });

    it('renders form controls', () => {
      renderWithProviders(<MarsRoverDetailPage />);
      
      expect(screen.getByLabelText('Earth Date')).toBeInTheDocument();
      expect(screen.getByLabelText('Camera')).toBeInTheDocument();
      expect(screen.getByText('Fetch Photos')).toBeInTheDocument();
    });
  });

  describe('API Integration', () => {
    it('fetches manifest data on component mount', async () => {
      renderWithProviders(<MarsRoverDetailPage />);
      
      await waitFor(() => {
        expect(marsRoverApi.getPhotos).toHaveBeenCalledWith('curiosity', {});
      });
    });

    it('displays manifest data when loaded', async () => {
      renderWithProviders(<MarsRoverDetailPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Curiosity')).toBeInTheDocument();
        expect(screen.getByText('active')).toBeInTheDocument();
        expect(screen.getByText('500,000')).toBeInTheDocument();
        expect(screen.getByText('Launched: 2011-11-26')).toBeInTheDocument();
        expect(screen.getByText('Landed: 2012-08-06')).toBeInTheDocument();
      });
    });

    it('fetches photos when form is submitted', async () => {
      renderWithProviders(<MarsRoverDetailPage />);
      
      const dateInput = screen.getByLabelText('Earth Date');
      const fetchButton = screen.getByText('Fetch Photos');
      
      fireEvent.change(dateInput, { target: { value: '2024-01-15' } });
      fireEvent.click(fetchButton);
      
      await waitFor(() => {
        expect(marsRoverApi.getPhotos).toHaveBeenCalledWith('curiosity', {
          earth_date: '2024-01-15',
          camera: '',
        });
      });
    });
  });

  describe('User Interactions', () => {
    it('allows date selection', () => {
      renderWithProviders(<MarsRoverDetailPage />);
      
      const dateInput = screen.getByLabelText('Earth Date');
      fireEvent.change(dateInput, { target: { value: '2024-01-15' } });
      
      expect(dateInput).toHaveValue('2024-01-15');
    });

    it('allows camera selection', () => {
      renderWithProviders(<MarsRoverDetailPage />);
      
      const cameraSelect = screen.getByLabelText('Camera');
      fireEvent.mouseDown(cameraSelect);
      
      // Wait for options to appear and select one
      waitFor(() => {
        const option = screen.getByText('Front Hazard Avoidance Camera');
        fireEvent.click(option);
        expect(cameraSelect).toHaveValue('FHAZ');
      });
    });

    it('shows validation error for missing date', async () => {
      renderWithProviders(<MarsRoverDetailPage />);
      
      const fetchButton = screen.getByText('Fetch Photos');
      fireEvent.click(fetchButton);
      
      await waitFor(() => {
        expect(screen.getByText('Please select a date to fetch photos.')).toBeInTheDocument();
      });
    });

    it('shows validation error for future date', async () => {
      renderWithProviders(<MarsRoverDetailPage />);
      
      const dateInput = screen.getByLabelText('Earth Date');
      const fetchButton = screen.getByText('Fetch Photos');
      
      // Set future date
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const futureDateString = futureDate.toISOString().split('T')[0];
      
      fireEvent.change(dateInput, { target: { value: futureDateString } });
      fireEvent.click(fetchButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Cannot fetch photos for future dates/)).toBeInTheDocument();
      });
    });
  });

  describe('Photo Gallery', () => {
    it('displays photos when fetched', async () => {
      renderWithProviders(<MarsRoverDetailPage />);
      
      const dateInput = screen.getByLabelText('Earth Date');
      const fetchButton = screen.getByText('Fetch Photos');
      
      fireEvent.change(dateInput, { target: { value: '2024-01-15' } });
      fireEvent.click(fetchButton);
      
      await waitFor(() => {
        expect(screen.getByText('Front Hazard Avoidance Camera')).toBeInTheDocument();
        expect(screen.getByText('Mast Camera')).toBeInTheDocument();
        expect(screen.getByText('2024-01-15')).toBeInTheDocument();
      });
    });

    it('shows no photos message when no results', async () => {
      (marsRoverApi.getPhotos as jest.Mock).mockResolvedValueOnce({
        photo_manifest: mockManifest,
        photos: [],
      });
      
      renderWithProviders(<MarsRoverDetailPage />);
      
      const dateInput = screen.getByLabelText('Earth Date');
      const fetchButton = screen.getByText('Fetch Photos');
      
      fireEvent.change(dateInput, { target: { value: '2024-01-15' } });
      fireEvent.click(fetchButton);
      
      await waitFor(() => {
        expect(screen.getByText('No photos found for the selected criteria.')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('displays API error message', async () => {
      (marsRoverApi.getPhotos as jest.Mock).mockRejectedValueOnce({
        response: { data: { error: 'Failed to fetch rover data' } },
      });
      
      renderWithProviders(<MarsRoverDetailPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Failed to fetch rover data')).toBeInTheDocument();
      });
    });

    it('displays 404 error for invalid rover', async () => {
      (marsRoverApi.getPhotos as jest.Mock).mockRejectedValueOnce({
        response: { status: 404 },
      });
      
      renderWithProviders(<MarsRoverDetailPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Rover not found. Please try a different rover.')).toBeInTheDocument();
      });
    });

    it('displays 400 error for invalid request', async () => {
      (marsRoverApi.getPhotos as jest.Mock).mockRejectedValueOnce({
        response: { status: 400 },
      });
      
      renderWithProviders(<MarsRoverDetailPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Invalid request. Please check your date and camera selection.')).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('shows loading spinner during initial load', () => {
      (marsRoverApi.getPhotos as jest.Mock).mockImplementation(() => new Promise(() => {}));
      
      renderWithProviders(<MarsRoverDetailPage />);
      
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('shows loading spinner during photo fetch', async () => {
      renderWithProviders(<MarsRoverDetailPage />);
      
      const dateInput = screen.getByLabelText('Earth Date');
      const fetchButton = screen.getByText('Fetch Photos');
      
      fireEvent.change(dateInput, { target: { value: '2024-01-15' } });
      fireEvent.click(fetchButton);
      
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('renders photo modal', async () => {
      renderWithProviders(<MarsRoverDetailPage />);
      
      const dateInput = screen.getByLabelText('Earth Date');
      const fetchButton = screen.getByText('Fetch Photos');
      
      fireEvent.change(dateInput, { target: { value: '2024-01-15' } });
      fireEvent.click(fetchButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('photo-modal')).toBeInTheDocument();
      });
    });
  });
}); 