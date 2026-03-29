import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
    "stories": [
        "../app/components/**/*.mdx",
        "../app/components/**/*.stories.@(js|jsx|mjs|ts|tsx)"
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
    ]
};
export default config;