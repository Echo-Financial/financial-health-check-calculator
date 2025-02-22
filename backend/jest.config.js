//backend/jest.config.js

module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(axios|@sendgrid)/)', // Transform axios and @sendgrid modules
  ],
  testEnvironment: 'node',
};
