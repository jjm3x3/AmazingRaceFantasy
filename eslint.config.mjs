import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";


export default [
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReactConfig,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.jest,
                browser: true,
                module: true
            }
        },
        rules: {
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
            semi: [
                "error",
                "always"
            ]
        }
    }];