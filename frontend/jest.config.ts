import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "node",
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
  testMatch: ["<rootDir>/src/tests/**/*.test.ts"],
  transform: { "^.+\\.tsx?$": ["ts-jest", { tsconfig: { module: "commonjs" } }] },
};

export default createJestConfig(config);
