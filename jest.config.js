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
  projects: [{
    "displayName": "frontend",
    testEnvironment: 'jsdom',
    "testMatch": ["<rootDir>/src/frontend/**/*.spec.ts", "<rootDir>/src/frontend/**/*.spec.tsx"],
    transform: {
      '^.+\\.(t|j)sx?$': 'ts-jest',
    },
    moduleNameMapper: {
      '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
      '\\.(gif|ttf|woff|otf|eot|png|jpg|svg)$': '<rootDir>/__mocks__/fileMock.js'
    }
  },
  {
    "displayName": "backend",
    testEnvironment: 'node',
    transform: {
      '^.+\\.(t|j)sx?$': 'ts-jest',
    },
    moduleFileExtensions: [
      'js',
      'jsx',
      'ts',
      'tsx',
    ],
    "setupFilesAfterEnv": ['./src/backend/utils/testing-utils/test-env-setup.ts'],
    "testMatch": ["<rootDir>/src/backend/**/*.spec.ts"],
    clearMocks: true,
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.test.json',
      }
    },
    preset: 'ts-jest/presets/js-with-ts',

  },
  {
    "displayName": "shared",
    testEnvironment: 'node',
    transform: {
      '^.+\\.(t|j)sx?$': 'ts-jest',
    },
    moduleFileExtensions: [
      'js',
      'jsx',
      'ts',
      'tsx',
    ],
    "testMatch": ["<rootDir>/src/shared/**/*.spec.ts"],
    clearMocks: true,
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.test.json',
      }
    },
    preset: 'ts-jest/presets/js-with-ts',

  }],
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
    }
  },
  preset: 'ts-jest/presets/js-with-ts',
}