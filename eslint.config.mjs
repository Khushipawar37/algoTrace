import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      "no-undef": "off",
    },
  },
  {
    ignores: [".next/**", "node_modules/**"],
  },
];

