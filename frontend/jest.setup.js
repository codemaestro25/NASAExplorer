// Mock window.scrollTo for all tests
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
}); 