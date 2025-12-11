import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";

export default [
    {
        ignores: [".next", "node_modules"],
        settings: {
            react: {
                version: "detect"
            }
        }
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReactConfig,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.jest,
                ...globals.node,
                browser: true,
                module: true
            }
        },
        rules: {
            "react/react-in-jsx-scope": "off",
            "react/no-unescaped-entities": "off",
            "no-unused-vars": ["error", {
                argsIgnorePattern: "^_[a-zA-Z]*",
                varsIgnorePattern: "^_[a-zA-Z]*"
            }],
            "@typescript-eslint/no-unused-vars": ["error", {
                argsIgnorePattern: "^_[a-zA-Z]*",
                varsIgnorePattern: "^_[a-zA-Z]*"
            }],
            indent: [
                "error",
                4
            ],
            "linebreak-style": [
                "error",
                "unix"
            ],
            quotes: [
                "error",
                "double"
            ],
        }
    }];
