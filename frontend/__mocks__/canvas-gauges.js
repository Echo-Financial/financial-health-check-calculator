// frontend/__mocks__/canvas-gauges.js

// Define a mock class that mimics the RadialGauge behavior
class MockRadialGauge {
  draw() {
    // This mock draw method can be empty or log for debugging
  }
  destroy() {
    // Cleanup method; no implementation needed for tests
  }
}

// Export an object with RadialGauge as a jest.fn constructor that returns a new instance of our mock
module.exports = {
  RadialGauge: jest.fn(() => new MockRadialGauge())
};
