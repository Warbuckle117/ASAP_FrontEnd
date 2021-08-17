module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  plugins: [
    'jest',
  ],
  extends: [
    'airbnb-base',
    'plugin:jest/recommended',
    'plugin:jest/style',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-console': 'off',
  },
};
