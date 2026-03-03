import js from '@eslint/js';
import prettier from 'eslint-config-prettier';

const nodeGlobals = {
  require: 'readonly',
  module: 'readonly',
  exports: 'writable',
  process: 'readonly',
  __dirname: 'readonly',
  __filename: 'readonly',
  Buffer: 'readonly',
  console: 'readonly',
  fetch: 'readonly',
};

const browserGlobals = {
  window: 'readonly',
  document: 'readonly',
  navigator: 'readonly',
  localStorage: 'readonly',
  FormData: 'readonly',
  URLSearchParams: 'readonly',
  confirm: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  ...nodeGlobals,
};

export default [
  js.configs.recommended,
  prettier,
  { ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.vite/**'] },
  {
    files: ['api/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: nodeGlobals,
    },
    rules: { 'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], 'no-console': 'off' },
  },
  {
    files: ['app/**/*.js', 'app/**/*.jsx', 'admin/**/*.js', 'admin/**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: browserGlobals,
    },
    rules: { 'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], 'no-console': 'off' },
  },
];
