/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
    roots: ["<rootDir>/__tests__"],
    testMatch: [
        "**/*.+(spec|test).+(ts|tsx|js)",
        "**/?(*.)+(spec|test).+(ts|tsx|js)",
    ],
    testEnvironment: "node",
    preset: "ts-jest/presets/js-with-ts",
    globals: {
        "ts-jest": {
            tsconfig: "tsconfig.test.json",
        },
    },

};
