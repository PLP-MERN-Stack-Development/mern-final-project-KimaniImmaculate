// backend/jest.config.js
export default {
  testEnvironment: 'node',
 transform: {}, 
 moduleNameMapper: {
   '^(\\.{1,2}/.*)\\.js$': '$1',
   // Map src/ imports correctly
   '^src/(.*)$': '<rootDir>/src/$1',
 },
};