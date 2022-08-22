module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx',
  ],
  coverageDirectory: '<rootDir>/coverage/jest',
  coverageReporters: [
    'json',
    'lcov',
    'text',
    'clover',
    'cobertura',
  ],
  reporters: [
    'default',
    'jest-junit',
  ],
  clearMocks: true,
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
  preset: 'ts-jest/presets/js-with-ts',
}