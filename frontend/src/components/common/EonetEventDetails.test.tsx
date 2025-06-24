import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EonetEventDetails from './EonetEventDetails';
import type { EONETEvent } from '../../types/nasa';

describe('EonetEventDetails', () => {
  const mockEvent: EONETEvent = {
    id: 'test-event-123',
    title: 'Test Wildfire Event',
    description: 'A major wildfire event in California',
    link: 'https://eonet.gsfc.nasa.gov/api/v3/events/test-event-123',
    categories: [
      {
        id: 'wildfires',
        title: 'Wildfires'
      }
    ],
    sources: [
      {
        id: 'NASA_EO',
        url: 'https://earthobservatory.nasa.gov/'
      }
    ],
    geometry: [
      {
        date: '2024-01-01T00:00:00Z',
        type: 'Point',
        coordinates: [-122.4194, 37.7749] // San Francisco coordinates
      }
    ]
  };

  it('renders event title', () => {
    render(<EonetEventDetails event={mockEvent} />);
    expect(screen.getByText('Test Wildfire Event')).toBeInTheDocument();
  });

  it('renders event description', () => {
    render(<EonetEventDetails event={mockEvent} />);
    expect(screen.getByText('A major wildfire event in California')).toBeInTheDocument();
  });

  it('renders category chips', () => {
    render(<EonetEventDetails event={mockEvent} />);
    expect(screen.getByText('Wildfires')).toBeInTheDocument();
    expect(screen.getByText('Wildfires')).toHaveClass('MuiChip-root');
  });

  it('renders multiple categories', () => {
    const eventWithMultipleCategories = {
      ...mockEvent,
      categories: [
        { id: 'wildfires', title: 'Wildfires' },
        { id: 'severe-storms', title: 'Severe Storms' }
      ]
    };
    render(<EonetEventDetails event={eventWithMultipleCategories} />);
    
    expect(screen.getByText('Wildfires')).toBeInTheDocument();
    expect(screen.getByText('Severe Storms')).toBeInTheDocument();
  });

  it('renders location coordinates when geometry is available', () => {
    render(<EonetEventDetails event={mockEvent} />);
    expect(screen.getByText(/Location: 37.77°N, -122.42°E/)).toBeInTheDocument();
  });

  it('renders sources section when sources are available', () => {
    render(<EonetEventDetails event={mockEvent} />);
    expect(screen.getByText('Sources:')).toBeInTheDocument();
    expect(screen.getByText('NASA_EO: https://earthobservatory.nasa.gov/')).toBeInTheDocument();
  });

  it('renders multiple sources', () => {
    const eventWithMultipleSources = {
      ...mockEvent,
      sources: [
        { id: 'NASA_EO', url: 'https://earthobservatory.nasa.gov/' },
        { id: 'NOAA', url: 'https://www.noaa.gov/' }
      ]
    };
    render(<EonetEventDetails event={eventWithMultipleSources} />);
    
    expect(screen.getByText('NASA_EO: https://earthobservatory.nasa.gov/')).toBeInTheDocument();
    expect(screen.getByText('NOAA: https://www.noaa.gov/')).toBeInTheDocument();
  });

  it('renders view source button when link is available', () => {
    render(<EonetEventDetails event={mockEvent} />);
    const linkButton = screen.getByRole('link', { name: /View Source/i });
    expect(linkButton).toBeInTheDocument();
    expect(linkButton).toHaveAttribute('href', 'https://eonet.gsfc.nasa.gov/api/v3/events/test-event-123');
    expect(linkButton).toHaveAttribute('target', '_blank');
  });

  it('does not render view source button when link is missing', () => {
    const eventWithoutLink = { ...mockEvent, link: undefined };
    render(<EonetEventDetails event={eventWithoutLink} />);
    expect(screen.queryByRole('link', { name: /View Source/i })).not.toBeInTheDocument();
  });

  it('handles event without geometry', () => {
    const eventWithoutGeometry = { ...mockEvent, geometry: undefined };
    render(<EonetEventDetails event={eventWithoutGeometry} />);
    expect(screen.queryByText(/Location:/)).not.toBeInTheDocument();
  });

  it('handles event without sources', () => {
    const eventWithoutSources = { ...mockEvent, sources: undefined };
    render(<EonetEventDetails event={eventWithoutSources} />);
    expect(screen.queryByText('Sources:')).not.toBeInTheDocument();
  });

  it('handles event without categories', () => {
    const eventWithoutCategories = { ...mockEvent, categories: [] };
    render(<EonetEventDetails event={eventWithoutCategories} />);
    expect(screen.queryByText('Wildfires')).not.toBeInTheDocument();
  });

  it('handles event without description', () => {
    const eventWithoutDescription = { ...mockEvent, description: undefined };
    render(<EonetEventDetails event={eventWithoutDescription} />);
    expect(screen.getByText('Test Wildfire Event')).toBeInTheDocument();
    expect(screen.queryByText('A major wildfire event in California')).not.toBeInTheDocument();
  });

  it('applies responsive styling to title', () => {
    render(<EonetEventDetails event={mockEvent} />);
    const title = screen.getByText('Test Wildfire Event');
    expect(title).toHaveStyle({ fontSize: expect.stringContaining('1.25rem') });
  });

  it('applies responsive styling to category chips', () => {
    render(<EonetEventDetails event={mockEvent} />);
    const chip = screen.getByText('Wildfires');
    expect(chip).toHaveStyle({ fontSize: expect.stringContaining('0.75rem') });
  });

  it('handles malformed geometry data gracefully', () => {
    const eventWithMalformedGeometry = {
      ...mockEvent,
      geometry: [
        {
          date: '2024-01-01T00:00:00Z',
          type: 'Point',
          coordinates: [null, 37.7749] // Invalid longitude
        }
      ]
    };
    render(<EonetEventDetails event={eventWithMalformedGeometry} />);
    
    // Should not crash and should still render other content
    expect(screen.getByText('Test Wildfire Event')).toBeInTheDocument();
  });

  it('handles very long URLs in sources', () => {
    const eventWithLongUrl = {
      ...mockEvent,
      sources: [
        {
          id: 'NASA_EO',
          url: 'https://very-long-url-that-might-break-layout.example.com/with/many/path/segments/and/parameters?param1=value1&param2=value2'
        }
      ]
    };
    render(<EonetEventDetails event={eventWithLongUrl} />);
    
    expect(screen.getByText(/NASA_EO: https:\/\/very-long-url/)).toBeInTheDocument();
  });
}); 