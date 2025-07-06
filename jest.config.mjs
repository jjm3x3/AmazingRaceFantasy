import nextJest from "next/jest.js";

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: "./",
});

// Add any custom config to be passed to Jest
const config = {
    // Add more setup options before each test is run
    // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
        "^jose": require.resolve("jose")
    },
    testEnvironment: "jest-environment-jsdom",
    setupFilesAfterEnv: ["<rootDir>/__tests__/setupTests.js"],
    testPathIgnorePatterns: ["<rootDir>/build/", "<rootDir>/node_modules/", "<rootDir>/__tests__/setupTests.js"]
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
