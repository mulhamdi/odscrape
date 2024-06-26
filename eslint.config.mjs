import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  pluginJs.configs.recommended,
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    rules: {
      'camelcase': 'error',
      'semi': ['error', 'always'],
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'no-const-assign': 'error',
      'no-use-before-define': 'error',
    },
  },
];
