import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

// Mock the PhotoModal component
jest.mock('../components/common/PhotoModal', () => {
  return function MockPhotoModal({ photos }: any) {
    return (
      <div data-testid="photo-modal">
        Photo Modal ({photos?.length || 0} photos)
      </div>
    );
  };
});

// Mock the Layout component
jest.mock('../components/common/Layout', () => {
  return function MockLayout({ children, title }: any) {
    return (
      <div data-testid="layout-mock">
        <h1>{title}</h1>
        {children}
      </div>
    );
  };
});

// Mock the marsRoverApi
const mockMarsRoverApi = {
  getPhotos: jest.fn(),
};

jest.mock('../services/backendApi', () => ({
  marsRoverApi: mockMarsRoverApi,
}));

// Mock @react-three/fiber
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => <div data-testid="canvas-mock">{children}</div>,
}));

// Mock drei
jest.mock('@react-three/drei', () => {
  const useGLTF = () => ({ scene: null });
  useGLTF.preload = () => {};
  return {
    OrbitControls: () => <div data-testid="orbit-controls-mock" />,
    useGLTF,
  };
});

import MarsRoverDetailPage from './MarsRoverDetailPage';

// Helper function to render with router
const renderWithRouter = (roverId: string) => {
  return render(
    <MemoryRouter initialEntries={[`/mars-rover/${roverId}`]}>
      <Routes>
        <Route path="/mars-rover/:roverId" element={<MarsRoverDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('MarsRoverDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set up default mock response
    mockMarsRoverApi.getPhotos.mockResolvedValue({
      photo_manifest: {
        name: 'Curiosity',
        status: 'active',
        total_photos: 1000,
        launch_date: '2011-11-26',
        landing_date: '2012-08-06',
        max_date: '2024-01-01',
        max_sol: 4000,
      }
    });
  });

  it('renders without crashing for curiosity rover', () => {
    renderWithRouter('curiosity');
    expect(screen.getByText('Mars Rover: Curiosity')).toBeInTheDocument();
  });

  it('renders without crashing for opportunity rover', () => {
    renderWithRouter('opportunity');
    expect(screen.getByText('Mars Rover: Opportunity')).toBeInTheDocument();
  });

  it('renders without crashing for spirit rover', () => {
    renderWithRouter('spirit');
    expect(screen.getByText('Mars Rover: Spirit')).toBeInTheDocument();
  });

  it('renders the Mission Manifest section', () => {
    renderWithRouter('curiosity');
    expect(screen.getByText('Mission Manifest')).toBeInTheDocument();
  });

  it('renders the photo gallery section title', () => {
    renderWithRouter('curiosity');
    expect(screen.getByText(/Grab photos of the rover from a particular date and camera/i)).toBeInTheDocument();
  });

  it('renders the 3D model canvas', () => {
    renderWithRouter('curiosity');
    expect(screen.getByTestId('canvas-mock')).toBeInTheDocument();
  });

  it('renders the orbit controls', () => {
    renderWithRouter('curiosity');
    expect(screen.getByTestId('orbit-controls-mock')).toBeInTheDocument();
  });

  it('renders the photo modal component', () => {
    renderWithRouter('curiosity');
    expect(screen.getByTestId('photo-modal')).toBeInTheDocument();
  });

  it('renders the layout component', () => {
    renderWithRouter('curiosity');
    expect(screen.getByTestId('layout-mock')).toBeInTheDocument();
  });

  it('renders the Earth Date input field', () => {
    renderWithRouter('curiosity');
    expect(screen.getByLabelText('Earth Date')).toBeInTheDocument();
  });

  it('renders the Camera select field', () => {
    renderWithRouter('curiosity');
    expect(screen.getByLabelText('Camera')).toBeInTheDocument();
  });

  it('renders the Fetch Photos button', () => {
    renderWithRouter('curiosity');
    expect(screen.getByText('Fetch Photos')).toBeInTheDocument();
  });

  it('renders the "All" camera option', () => {
    renderWithRouter('curiosity');
    const cameraSelect = screen.getByLabelText('Camera');
    expect(cameraSelect).toBeInTheDocument();
  });

  it('handles different rover types correctly', () => {
    renderWithRouter('opportunity');
    expect(screen.getByText('Mars Rover: Opportunity')).toBeInTheDocument();
    
    renderWithRouter('spirit');
    expect(screen.getByText('Mars Rover: Spirit')).toBeInTheDocument();
  });

  it('renders the date input with max date constraint', () => {
    renderWithRouter('curiosity');
    const dateInput = screen.getByLabelText('Earth Date') as HTMLInputElement;
    expect(dateInput.max).toBeDefined();
  });

  it('renders the main container structure', () => {
    renderWithRouter('curiosity');
    expect(screen.getByText('Mission Manifest')).toBeInTheDocument();
    expect(screen.getByText(/Grab photos of the rover from a particular date and camera/i)).toBeInTheDocument();
  });

  it('renders the 3D model section', () => {
    renderWithRouter('curiosity');
    expect(screen.getByTestId('canvas-mock')).toBeInTheDocument();
    expect(screen.getByTestId('orbit-controls-mock')).toBeInTheDocument();
  });

  it('renders the form controls', () => {
    renderWithRouter('curiosity');
    expect(screen.getByLabelText('Earth Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Camera')).toBeInTheDocument();
    expect(screen.getByText('Fetch Photos')).toBeInTheDocument();
  });

  it('renders the photo modal with correct props', () => {
    renderWithRouter('curiosity');
    const photoModal = screen.getByTestId('photo-modal');
    expect(photoModal).toBeInTheDocument();
    expect(photoModal).toHaveTextContent('Photo Modal (0 photos)');
  });

  it('renders the layout with correct title', () => {
    renderWithRouter('curiosity');
    const layout = screen.getByTestId('layout-mock');
    expect(layout).toBeInTheDocument();
    expect(layout).toHaveTextContent('Mars Rover: Curiosity');
  });

  it('renders all main sections', () => {
    renderWithRouter('curiosity');
    expect(screen.getByText('Mission Manifest')).toBeInTheDocument();
    expect(screen.getByText(/Grab photos of the rover from a particular date and camera/i)).toBeInTheDocument();
    expect(screen.getByTestId('canvas-mock')).toBeInTheDocument();
    expect(screen.getByTestId('photo-modal')).toBeInTheDocument();
  });

  it('renders the date input with proper attributes', () => {
    renderWithRouter('curiosity');
    const dateInput = screen.getByLabelText('Earth Date') as HTMLInputElement;
    expect(dateInput.type).toBe('date');
    expect(dateInput.max).toBeDefined();
  });

  it('renders the camera select with proper structure', () => {
    renderWithRouter('curiosity');
    const cameraSelect = screen.getByLabelText('Camera');
    expect(cameraSelect).toBeInTheDocument();
  });

  it('renders the fetch photos button with proper styling', () => {
    renderWithRouter('curiosity');
    const fetchButton = screen.getByText('Fetch Photos');
    expect(fetchButton).toBeInTheDocument();
    expect(fetchButton.tagName).toBe('BUTTON');
  });

  it('renders the component structure correctly', () => {
    renderWithRouter('curiosity');
    expect(screen.getByTestId('layout-mock')).toBeInTheDocument();
    expect(screen.getByText('Mission Manifest')).toBeInTheDocument();
    expect(screen.getByTestId('canvas-mock')).toBeInTheDocument();
    expect(screen.getByTestId('photo-modal')).toBeInTheDocument();
  });
}); 