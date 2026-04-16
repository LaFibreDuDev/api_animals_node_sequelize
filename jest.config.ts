import type { Config } from "jest";

const config: Config = {
    testEnvironment: "node",
    transform: {
        "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.test.json" }],
    },
    testMatch: [
        "**/tests/unit/**/*.test.ts",
        "**/tests/integration/**/*.test.ts",
    ],
};

export default config;
