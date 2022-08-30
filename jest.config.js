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
    clearMocks: true,
    "setupFilesAfterEnv": ['./testing/test-env-setup.frontend.ts'],
    "globalSetup": './testing/test-global-setup.frontend.ts',
    "globalTeardown": './testing/test-global-teardown.frontend.ts',
    moduleNameMapper: {
      '\\.(css|less|sass|scss)$': '<rootDir>/testing/mocks/styleMock.js',
      '\\.(gif|ttf|woff|otf|eot|png|jpg|svg)$': '<rootDir>/testing/mocks/fileMock.js'
    },
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.test.json',
      }
    },
    preset: 'ts-jest/presets/js-with-ts',

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
    "setupFilesAfterEnv": ['./testing/test-env-setup.backend.ts'],
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