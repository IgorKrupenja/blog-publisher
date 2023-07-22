/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  extends: ['eslint:recommended'],
  plugins: ['prettier', 'simple-import-sort', 'unused-imports'],
  rules: {
    'no-return-await': 'warn',
    'prettier/prettier': ['warn', { singleQuote: true, trailingComma: 'es5', printWidth: 100 }],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
  env: {
    node: true,
  },
  overrides: [
    {
      // Ignore various JS config files
      files: ['**/*.ts'],
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      parserOptions: {
        project: './tsconfig.json',
      },
      rules: {
        'no-unused-vars': 'off',
        // Disabling the base rule as it can report incorrect errors
        'require-await': 'off',
        '@typescript-eslint/require-await': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
          'warn',
          {
            vars: 'all',
            varsIgnorePattern: '^_',
            args: 'after-used',
            argsIgnorePattern: '^_',
          },
        ],
      },
    },
  ],
};
