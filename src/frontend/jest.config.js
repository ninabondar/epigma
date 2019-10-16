module.exports = {
  verbose: true,
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testPathIgnorePatterns: ['node_modules'],
  setupFiles: ['<rootDir>/src/setupTest.js'],
  collectCoverageFrom: ['<rootDir>/src/**/*.js'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  moduleNameMapper: { '^.+\\.(css|scss)$': 'identity-obj-proxy' }
}