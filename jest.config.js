module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest', 
    "^.+\\.svg$": "jest-svg-transformer"  
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
    testEnvironment: './testing/custom-env.frontend.ts',
    "testMatch": ["<rootDir>/src/frontend/**/*.spec.ts", "<rootDir>/src/frontend/**/*.spec.tsx"],
    transform: {
      '^.+\\.(t|j)sx?$': 'ts-jest',
    },
    clearMocks: true,
    "setupFilesAfterEnv": ['./testing/test-env-setup.frontend.ts'],
    moduleNameMapper: {
      '\\.(css|less|sass|scss)$': '<rootDir>/testing/mocks/styleMock.js',
      '\\.(gif|ttf|woff|otf|eot|png|jpg|svg|woff2)$': '<rootDir>/testing/mocks/fileMock.ts'
    },
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.test.json',
      },
      crypto: require("crypto")
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