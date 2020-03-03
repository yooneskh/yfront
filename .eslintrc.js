module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-import-assign': 2,
    'default-case': 'error',
    'no-eval': 'error',
    'no-floating-decimal': 'error',
    'no-return-await': 'error',
    'no-useless-concat': 'error',
    'radix': 'error',
    'no-shadow': 'error',
    'no-use-before-define': 'error',
    'eqeqeq': ['error', 'always'],
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
