/** @type {import('ts-jest').JestConfigWithTsJest} */
const { pathsToModuleNameMapper } = require("ts-jest");
const tsconfig = require("./tsconfig");
const moduleNameMapper = require("tsconfig-paths-jest")(tsconfig);
module.exports = {
    transform: {
        "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.test.json" }],
    },
    roots: ["<rootDir>/__tests__"],
    testMatch: [
        "**/*.+(spec|test).+(ts|tsx|js)",
        "**/?(*.)+(spec|test).+(ts|tsx|js)",
    ],
    testEnvironment: "node",
    preset: "ts-jest/presets/js-with-ts",
    moduleNameMapper,
};
