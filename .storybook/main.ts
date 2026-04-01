import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
    "stories": [
        "../app/components/baseComponents/**/*.mdx",
        "../app/components/baseComponents/**/*.stories.@(js|jsx|mjs|ts|tsx)"
    ],
    "addons": [
        "@chromatic-com/storybook",
        "@storybook/addon-vitest",
        "@storybook/addon-a11y",
        "@storybook/addon-docs"
    ],
    "framework": "@storybook/nextjs-vite",
    "staticDirs": [
        "../public"
    ],
    typescript: {
        reactDocgen: "react-docgen-typescript",
    },
};
export default config;