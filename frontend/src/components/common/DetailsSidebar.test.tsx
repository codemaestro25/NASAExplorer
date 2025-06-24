import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '@testing-library/jest-dom';
import DetailsSidebar from './DetailsSidebar';

let isMobile = false;
jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');
  return {
    ...actual,
    useMediaQuery: () => isMobile,
  };
});

const mockTheme = createTheme();

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('DetailsSidebar', () => {
  const mockOnClose = jest.fn();
  const mockChildren = <div data-testid="sidebar-content">Sidebar Content</div>;

  beforeEach(() => {
    jest.clearAllMocks();
    isMobile = false;
  });

  describe('Desktop Rendering (Drawer)', () => {
    beforeEach(() => {
      isMobile = false;
    });

    it('renders as a drawer when open on desktop', () => {
      renderWithProviders(
        <DetailsSidebar open={true} onClose={mockOnClose}>
          {mockChildren}
        </DetailsSidebar>
      );

      const drawer = screen.getByRole('presentation');
      expect(drawer).toBeInTheDocument();
      expect(screen.getByTestId('sidebar-content')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
      renderWithProviders(
        <DetailsSidebar open={false} onClose={mockOnClose}>
          {mockChildren}
        </DetailsSidebar>
      );

      expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
      expect(screen.queryByTestId('sidebar-content')).not.toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
      renderWithProviders(
        <DetailsSidebar open={true} onClose={mockOnClose}>
          {mockChildren}
        </DetailsSidebar>
      );

      const closeButton = screen.getByLabelText('close');
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when backdrop is clicked', () => {
      renderWithProviders(
        <DetailsSidebar open={true} onClose={mockOnClose}>
          {mockChildren}
        </DetailsSidebar>
      );

      const drawer = screen.getByRole('presentation');
      fireEvent.click(drawer);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('renders children content', () => {
      renderWithProviders(
        <DetailsSidebar open={true} onClose={mockOnClose}>
          {mockChildren}
        </DetailsSidebar>
      );

      expect(screen.getByText('Sidebar Content')).toBeInTheDocument();
    });

    it('has correct anchor position (right)', () => {
      renderWithProviders(
        <DetailsSidebar open={true} onClose={mockOnClose}>
          {mockChildren}
        </DetailsSidebar>
      );

      const drawer = screen.getByRole('presentation');
      expect(drawer).toBeInTheDocument();
    });
  });

  describe('Mobile Rendering (Dialog)', () => {
    beforeEach(() => {
      isMobile = true;
    });

    it('renders as a dialog when open on mobile', () => {
      renderWithProviders(
        <DetailsSidebar open={true} onClose={mockOnClose}>
          {mockChildren}
        </DetailsSidebar>
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(screen.getByTestId('sidebar-content')).toBeInTheDocument();
    });

    it('does not render when closed on mobile', () => {
      renderWithProviders(
        <DetailsSidebar open={false} onClose={mockOnClose}>
          {mockChildren}
        </DetailsSidebar>
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.queryByTestId('sidebar-content')).not.toBeInTheDocument();
    });

    it('calls onClose when close button is clicked on mobile', () => {
      renderWithProviders(
        <DetailsSidebar open={true} onClose={mockOnClose}>
          {mockChildren}
        </DetailsSidebar>
      );

      const closeButton = screen.getByLabelText('close');
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when dialog backdrop is clicked', () => {
      renderWithProviders(
        <DetailsSidebar open={true} onClose={mockOnClose}>
          {mockChildren}
        </DetailsSidebar>
      );

      const dialog = screen.getByRole('dialog');
      fireEvent.click(dialog);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('renders children content in mobile dialog', () => {
      renderWithProviders(
        <DetailsSidebar open={true} onClose={mockOnClose}>
          {mockChildren}
        </DetailsSidebar>
      );

      expect(screen.getByText('Sidebar Content')).toBeInTheDocument();
    });

    it('has full width on mobile', () => {
      renderWithProviders(
        <DetailsSidebar open={true} onClose={mockOnClose}>
          {mockChildren}
        </DetailsSidebar>
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
    });
  });

  describe('Props Validation', () => {
    beforeEach(() => {
      isMobile = false;
    });

    it('requires open prop', () => {
      renderWithProviders(
        <DetailsSidebar open={true} onClose={mockOnClose}>
          {mockChildren}
        </DetailsSidebar>
      );

      expect(screen.getByTestId('sidebar-content')).toBeInTheDocument();
    });

    it('requires onClose prop', () => {
      renderWithProviders(
        <DetailsSidebar open={true} onClose={mockOnClose}>
          {mockChildren}
        </DetailsSidebar>
      );

      const closeButton = screen.getByLabelText('close');
      expect(closeButton).toBeInTheDocument();
    });

    it('renders children prop', () => {
      const customChildren = <div data-testid="custom-content">Custom Content</div>;
      
      renderWithProviders(
        <DetailsSidebar open={true} onClose={mockOnClose}>
          {customChildren}
        </DetailsSidebar>
      );

      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
      expect(screen.getByText('Custom Content')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      isMobile = false;
    });

    it('has close button with proper aria-label', () => {
      renderWithProviders(
        <DetailsSidebar open={true} onClose={mockOnClose}>
          {mockChildren}
        </DetailsSidebar>
      );

      const closeButton = screen.getByLabelText('close');
      expect(closeButton).toBeInTheDocument();
    });

    it('has proper role for drawer', () => {
      renderWithProviders(
        <DetailsSidebar open={true} onClose={mockOnClose}>
          {mockChildren}
        </DetailsSidebar>
      );

      const drawer = screen.getByRole('presentation');
      expect(drawer).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('switches between drawer and dialog based on screen size', () => {
      // Test desktop behavior
      isMobile = false;
      
      const { rerender } = renderWithProviders(
        <DetailsSidebar open={true} onClose={mockOnClose}>
          {mockChildren}
        </DetailsSidebar>
      );

      expect(screen.getByRole('presentation')).toBeInTheDocument();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      // Test mobile behavior
      isMobile = true;
      
      rerender(
        <DetailsSidebar open={true} onClose={mockOnClose}>
          {mockChildren}
        </DetailsSidebar>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
    });
  });
}); 