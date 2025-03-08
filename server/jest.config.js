/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js"],
  testMatch: ["**/tests/**/*.(test|spec).ts?(x)"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};