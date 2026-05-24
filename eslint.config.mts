import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],

    languageOptions: {
      globals: globals.node,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn'],
      'indent': [
        'error',
        2
      ],
      'linebreak-style': [
        'error',
        'windows'
      ],
      'quotes': [
        'error',
        'single',
        {
          'avoidEscape': true
        }
      ],
      'semi': [
        'error',
        'always'
      ],
      'no-multiple-empty-lines': [
        'error',
        {
          'max': 1,
          'maxEOF': 0,
          'maxBOF': 0
        }
      ],
      'eol-last': [
        'error',
        'always'
      ],
      'lines-between-class-members': [
        'error',
        'always',
        {
          'exceptAfterSingleLine': true
        }
      ],
      'padding-line-between-statements': [
        'error',
        {
          'blankLine': 'always',
          'prev': '*',
          'next': 'function'
        },
        {
          'blankLine': 'always',
          'prev': 'function',
          'next': '*'
        },
        {
          'blankLine': 'always',
          'prev': '*',
          'next': 'class'
        },
        {
          'blankLine': 'always',
          'prev': 'class',
          'next': '*'
        },
        {
          'blankLine': 'always',
          'prev': '*',
          'next': 'export'
        },
        {
          'blankLine': 'always',
          'prev': 'import',
          'next': '*'
        },
        {
          'blankLine': 'never',
          'prev': 'import',
          'next': 'import'
        },
        {
          'blankLine': 'always',
          'prev': '*',
          'next': 'return'
        }
      ],
      'object-curly-spacing': [
        'error',
        'always'
      ],
      'array-bracket-spacing': [
        'error',
        'never'
      ],
      'comma-spacing': [
        'error',
        {
          'before': false,
          'after': true
        }
      ],
      'keyword-spacing': [
        'error',
        {
          'before': true,
          'after': true
        }
      ],
      'space-before-blocks': [
        'error',
        'always'
      ],
      'space-before-function-paren': [
        'error',
        {
          'anonymous': 'never',
          'named': 'never',
          'asyncArrow': 'always'
        }
      ],
      'key-spacing': ['error', { 'beforeColon': false, 'afterColon': true }],
    },
  },
]);
