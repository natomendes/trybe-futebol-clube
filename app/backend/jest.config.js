module.exports = {
  // collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/app.ts'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'jest-environment-node',
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.spec.ts'],
};
