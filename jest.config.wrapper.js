/**
 * Configuração do Jest específica para testes de componentes wrapper
 * Esta configuração não depende do MSW ou outros serviços externos
 */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/components/wrapper-test.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
  },
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.jest.json',
      },
    ],
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  testMatch: [
    '<rootDir>/src/components/GridItem.test.tsx',
    '<rootDir>/src/components/GridContainer.test.tsx',
    '<rootDir>/src/components/ListItemWrapper.test.tsx',
    '<rootDir>/src/components/MenuItemWrapper.test.tsx',
  ],
  collectCoverageFrom: [
    'src/components/GridItem.tsx',
    'src/components/GridContainer.tsx',
    'src/components/ListItemWrapper.tsx',
    'src/components/MenuItemWrapper.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage/wrapper-components',
  collectCoverage: true,
  verbose: true,
  testPathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testTimeout: 30000,
};
