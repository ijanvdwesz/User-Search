module.exports = {
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/src/setupTests.js'],
  testMatch: [
    '**/src/test/**/*.(test|spec).(js|jsx)',
  ]
};