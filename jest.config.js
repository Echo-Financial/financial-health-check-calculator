// jest.config.js
export default {
  transformIgnorePatterns: [
    "/node_modules/(?!(axios)/)"
  ],
  setupFiles: ["<rootDir>/jest.setup.js"],
  testEnvironment: "node"
};
