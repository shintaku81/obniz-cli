// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier";

const config = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2017,
        ...globals.browser,
      },
      parserOptions: {
        sourceType: "module",
        ecmaVersion: 2017,
      },
    },
    rules: {
      "no-console": "off",
      "no-inner-declarations": "warn",
      "no-constant-condition": [
        "error",
        {
          checkLoops: false,
        },
      ],
      "no-unused-vars": [
        "warn",
        {
          args: "none",
        },
      ],
      "no-var": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "none",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
);

export default config;
