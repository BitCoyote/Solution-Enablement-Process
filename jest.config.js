module.exports = {
    transform: {
      '^.+\\.(t|j)sx?$': 'ts-jest'
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    coverageDirectory: '<rootDir>/coverage/jest',
    coverageReporters: ["json", "lcov", "text", "clover", "cobertura"],
    reporters: [
      'default',
      'jest-junit'
    ],
    clearMocks: true,
    globals: {
      'ts-jest': {
        tsConfig: 'tsconfig.test.json'
      }
    }
  };
