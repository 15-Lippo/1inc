module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      // Allows for the parsing of JSX
      jsx: true,
    },
  },
  env: {
    browser: true,
    jest: true,
    es2020: true,
  },
  extends: [
    'prettier',
    'react-app',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  plugins: ['prettier', 'simple-import-sort', 'unused-imports'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'unused-imports/no-unused-imports': 'error',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'prettier/prettier': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'object-shorthand': ['error', 'always'],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'ethers',
            message: "Please import from '@ethersproject/module' directly to support tree-shaking.",
          },
          {
            name: 'styled-components',
            message: 'Please import from styled-components/macro.',
          },
        ],
        patterns: [
          {
            group: ['**/dist'],
            message:
              'Do not import from dist/ - this is an implementation detail, and breaks tree-shaking.',
          },
        ],
      },
    ],
  },
  ignorePatterns: [
    'node_modules',
    'coverage',
    'build',
    'dist',
    '.DS_Store',
    '.env.local',
    '.env.development.local',
    '.env.test.local',
    '.env.production.local',
    '.idea/',
    '.vscode/',
    'package-lock.json',
    'yarn.lock',
  ],
};
