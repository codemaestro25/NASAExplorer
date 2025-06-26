import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// to avoid useNavigate error
jest.mock('../components/MarsRover/MarsRoverSelector', () => () => <div data-testid="marsroverselector-mock" />);

import EarthPage from './EarthPage';

describe('EarthPage (simple)', () => {
  it('renders without crashing', () => {
    render(<EarthPage />);
    expect(screen.getAllByText(/Earth/i).length).toBeGreaterThan(0);
  });

  it('renders the Mars Rover Gallery section', () => {
    render(<EarthPage />);
    expect(screen.getByText(/Mars Rover Gallery/i)).toBeInTheDocument();
    expect(screen.getByTestId('marsroverselector-mock')).toBeInTheDocument();
  });

  it('renders the NASA title in splash screen', () => {
    render(<EarthPage />);
    expect(screen.getByText('NASA')).toBeInTheDocument();
  });

  it('renders the "Earth & Mars explorer" subtitle', () => {
    render(<EarthPage />);
    expect(screen.getByText('Earth & Mars explorer')).toBeInTheDocument();
  });

  it('renders the "Launch" button', () => {
    render(<EarthPage />);
    expect(screen.getByText('Launch')).toBeInTheDocument();
  });

  it('renders the Real-Time Earth Events section', () => {
    render(<EarthPage />);
    expect(screen.getByText('Real-Time Earth Events')).toBeInTheDocument();
  });

  it('renders the Near Earth Objects section', () => {
    render(<EarthPage />);
    expect(screen.getByText('Near Earth Objects')).toBeInTheDocument();
  });

  it('renders the Earth Observatory Natural Event Tracker card title', () => {
    render(<EarthPage />);
    expect(screen.getByText('Earth Observatory Natural Event Tracker')).toBeInTheDocument();
  });

  it('renders the Near Earth Object Tracker card title', () => {
    render(<EarthPage />);
    expect(screen.getByText('Near Earth Object Tracker')).toBeInTheDocument();
  });

  it('renders loading text for events', () => {
    render(<EarthPage />);
    expect(screen.getByText('Loading events...')).toBeInTheDocument();
  });

  it('renders the description about exploring NASA data', () => {
    render(<EarthPage />);
    expect(screen.getByText(/Explore NASA's Earth, asteroid, and Mars rover data/i)).toBeInTheDocument();
  });

  it('renders the description about real-time natural events', () => {
    render(<EarthPage />);
    expect(screen.getByText(/Explore real-time natural events happening around the world/i)).toBeInTheDocument();
  });

  it('renders the description about asteroids and comets', () => {
    render(<EarthPage />);
    expect(screen.getByText(/Asteroids and comets passing close to Earth/i)).toBeInTheDocument();
  });

  it('renders the Mars rover description', () => {
    render(<EarthPage />);
    expect(screen.getByText(/Click a rover to explore its mission, stats, and photos from Mars/i)).toBeInTheDocument();
  });

  it('renders multiple sections with proper heading structure', () => {
    render(<EarthPage />);
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(3); // at least NASA, Earth Events, NEOs, Mars Rover Gallery
  });
}); 