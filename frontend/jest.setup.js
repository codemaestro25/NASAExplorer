// Mock window.scrollTo for all tests
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
});

// Add TextEncoder and TextDecoder polyfills for Node.js environment
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// Polyfill for ResizeObserver (required by @react-three/fiber and react-use-measure)
global.ResizeObserver = global.ResizeObserver || class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Polyfill for IntersectionObserver (required by APODSection and scroll animations)
global.IntersectionObserver = global.IntersectionObserver || class {
  observe() {}
  unobserve() {}
  disconnect() {}
}; 