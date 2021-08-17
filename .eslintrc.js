module.exports = {
  env: {
    commonjs: true,
    es2020: true,
  },
  plugins: [
    'jest',
    'react',
    'import',
    'react-hooks',
  ],
  extends: [
    'airbnb-base',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 11,
    ecmaFeatures: {
      jsx: true,
    },
    requireConfigFile: false,
  },
  rules: {
    'no-console': 'off',
  },
};
