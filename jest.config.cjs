module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  transform: {},
  globalSetup: "<rootDir>/tests/globalSetup.js",
  moduleNameMapper: {
    "^#/(.*)$": "<rootDir>/$1",
  },
};