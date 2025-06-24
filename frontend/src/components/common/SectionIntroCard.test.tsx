import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SectionIntroCard from './SectionIntroCard';

describe('SectionIntroCard', () => {
  const defaultProps = {
    title: 'Test Title',
    cardTitle: 'Test Card Title',
    cardDescription: 'Test card description',
    cardStats: <div data-testid="test-stats">Test Stats</div>,
    visible: true,
  };

  it('renders with all required props', () => {
    render(<SectionIntroCard {...defaultProps} />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Card Title')).toBeInTheDocument();
    expect(screen.getByText('Test card description')).toBeInTheDocument();
    expect(screen.getByTestId('test-stats')).toBeInTheDocument();
  });

  it('renders with left alignment by default', () => {
    render(<SectionIntroCard {...defaultProps} />);
    const container = screen.getByText('Test Title').closest('div');
    expect(container).toHaveStyle({ alignItems: 'flex-start' });
  });

  it('renders with right alignment when specified', () => {
    render(<SectionIntroCard {...defaultProps} align="right" />);
    const container = screen.getByText('Test Title').closest('div');
    expect(container).toHaveStyle({ alignItems: 'flex-end' });
  });

  it('shows error when provided', () => {
    const errorMessage = 'Test error message';
    render(<SectionIntroCard {...defaultProps} error={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('does not show error when not provided', () => {
    render(<SectionIntroCard {...defaultProps} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('applies visibility styles when visible is true', () => {
    render(<SectionIntroCard {...defaultProps} visible={true} />);
    const title = screen.getByText('Test Title');
    const card = screen.getByText('Test Card Title').closest('.MuiCard-root');
    
    expect(title).toHaveStyle({ opacity: '1' });
    expect(card).toHaveStyle({ opacity: '1' });
  });

  it('applies hidden styles when visible is false', () => {
    render(<SectionIntroCard {...defaultProps} visible={false} />);
    const title = screen.getByText('Test Title');
    const card = screen.getByText('Test Card Title').closest('.MuiCard-root');
    
    expect(title).toHaveStyle({ opacity: '0' });
    expect(card).toHaveStyle({ opacity: '0' });
  });

  it('renders with monospace font family', () => {
    render(<SectionIntroCard {...defaultProps} />);
    const container = screen.getByText('Test Title').closest('div');
    expect(container).toHaveStyle({ fontFamily: expect.stringContaining('Fira Mono') });
  });

  it('renders title with gradient background', () => {
    render(<SectionIntroCard {...defaultProps} />);
    const title = screen.getByText('Test Title');
    expect(title).toHaveStyle({ 
      background: expect.stringContaining('linear-gradient'),
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    });
  });

  it('renders card with correct styling', () => {
    render(<SectionIntroCard {...defaultProps} />);
    const card = screen.getByText('Test Card Title').closest('.MuiCard-root');
    expect(card).toHaveStyle({
      background: expect.stringContaining('linear-gradient'),
      border: expect.stringContaining('1px solid')
    });
  });

  it('handles complex cardStats content', () => {
    const complexStats = (
      <div>
        <span>Events shown: </span>
        <b>5</b>
      </div>
    );
    render(<SectionIntroCard {...defaultProps} cardStats={complexStats} />);
    
    expect(screen.getByText('Events shown:')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('applies responsive styles', () => {
    render(<SectionIntroCard {...defaultProps} />);
    const container = screen.getByText('Test Title').closest('div');
    
    // Check for responsive width
    expect(container).toHaveStyle({
      width: expect.stringContaining('100%')
    });
  });
}); 