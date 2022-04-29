module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    jest: true,
    es2020: true,
  },
  extends: ['airbnb', 'prettier', 'plugin:prettier/recommended', 'plugin:jest/recommended'],
  plugins: ['prettier', 'jest'],
  settings: {
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    'prettier/prettier': ['error', { singleQuote: true, endOfLine: 'auto' }],
    'import/extensions': [0],
    'react/jsx-filename-extension': [0],
    'prefer-destructuring': ['error', { object: true, array: false }],
    'react/jsx-closing-bracket-location': [
      1,
      { selfClosing: 'line-aligned', nonEmpty: 'after-props' },
    ],
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': 'off',
    'no-negated-condition': 'error',
    'import/prefer-default-export': 'off',
    'no-param-reassign': 'off',
    'no-shadow': 'off',
    'no-implicit-coercion': [
      'error',
      {
        boolean: true,
        number: true,
        string: true,
        allow: [],
      },
    ],
    'react/prop-types': 'off',
    'jsx-a11y/anchor-is-valid': ['error', { components: ['Link'], specialLink: ['onClick', 'to'] }],
  },
  ignorePatterns: ['/dist/*', '/coverage/*', '/lib/*', '**/api/**'],
};
