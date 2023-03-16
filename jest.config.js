/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    "**/tests/**/*.test.ts"
  ],
  collectCoverageFrom: [
    "src/**/*.ts"
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'json-summary',
    'text',
    'lcov'
  ]
}
