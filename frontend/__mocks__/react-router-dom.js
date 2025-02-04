// frontend/__mocks__/react-router-dom.js
const actualModule = jest.requireActual('react-router-dom');
const navigateMock = jest.fn();

// Export everything from the actual module,
// but override useNavigate and optionally export the navigateMock.
module.exports = {
  __esModule: true,
  ...actualModule,
  useNavigate: () => navigateMock,
  // Export the mock for assertions in tests if needed.
  _navigateMock: navigateMock,
};
