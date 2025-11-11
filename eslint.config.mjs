import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import react from "eslint-plugin-react";
import prettier from "eslint-plugin-prettier";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";

export default [
  {
    ignores: ["node_modules", ".next", "dist", "next-env.d.ts"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      prettier,
      import: importPlugin,
      "unused-imports": unusedImports,
    },
    rules: {
      // General TypeScript/ JS rules
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" },
      ],

      // Enforce consistent order and style for imports
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      // React & Hooks
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Style via Prettier
      "prettier/prettier": [
        "error",
        {
          semi: true, // always end statements with a semi-colon
          singleQuote: false, // Use double quotes only for strings etc
          trailingComma: "es5", // always add trailing commas (eg in objects/ arrays) where valid
           // indentation + spacing default to 4 tab style
          tabWidth: 4,
          useTabs: true,
          printWidth: 100, // wrap lines at 100 characters maximum
          endOfLine: "auto", // auto use for system's line end encoding (portable)
        },
      ],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
