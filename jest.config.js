module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  moduleFileExtensions: ['ts', 'js'],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/"
  ],
};