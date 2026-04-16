import type { Config } from "jest";

const config: Config = {
    testEnvironment: "node",
    transform: {
        "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.test.json" }],
    },
    testMatch: ["**/tests/e2e/**/*.e2e.test.ts"],
    globalSetup: "<rootDir>/tests/e2e/setup/globalSetup.ts",
    globalTeardown: "<rootDir>/tests/e2e/setup/globalTeardown.ts",
    setupFiles: ["<rootDir>/tests/e2e/setup/env.ts"],
};

export default config;
