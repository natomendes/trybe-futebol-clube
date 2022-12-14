module.exports = {
  // collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'jest-environment-node',
  transform: {
    '.+\\.ts$': [
      'ts-jest', {
        sourceMaps: true,
        module: {
          type: 'commonjs',
        },
      }],
  },
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.spec.ts'],
};
