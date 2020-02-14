// http://eslint.org/docs/user-guide/configuring
const path = require('path');

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: false,
    node: true,
    es6: true,
  },
  extends: ['airbnb'],
  plugins: ['prettier', 'html'],
  rules: {
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-trailing-spaces': 1,
    'no-undef': 0,
    semi: [0],
    'arrow-parens': ['error', 'as-needed'],
    'operator-linebreak': [1, 'after'],
    'implicit-arrow-linebreak': [1, 'beside'],
    'no-unused-vars': 1,
    camelcase: 1,
    'no-plusplus': 0,
    'vars-on-top': 1,
    'no-var': 1,
    'no-unused-expressions': 1,
    'no-useless-escape': 1,
    'lines-between-class-members': [1, 'always'],
    'prefer-template': 1,
    'prefer-const': 1,
    'spaced-comment': 1,
    'consistent-return': 0,
    'no-empty': 1,
    'no-lonely-if': 0,
    'no-else-return': 0,
    'no-throw-literal': 0,
    'import/no-unresolved': 1,
    'no-trailing-spaces': 1,
    'max-len': [1, { code: 80 }],
    'prefer-destructuring': 1,
    'no-restricted-syntax': 0,
    'guard-for-in': 0,
    eqeqeq: 1,
    'import/prefer-default-export': 0,
    radix: 0,
    'func-names': 0,
    'import/no-unresolved': 1,
    'import/extensions': 1,
    'no-loop-func': 0,
    'no-prototype-builtins': 0,
    'comma-dangle': 1,
    'operator-assignment': 0,
    'no-underscore-dangle': 0,
    //
    'no-param-reassign': 1,
    'no-console': 0,
    //
    'no-param-reassign': 0,
    'no-shadow': 0,
    // wechat
    'no-await-in-loop': 0,
    //
    'import/no-mutable-exports': 1,
    // react
    'react/prop-types': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'class-methods-use-this': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/no-static-element-interactions': 0,
  },
  // globals: {
  //   App: true,
  //   Page: true,
  //   wx: true,
  //   getApp: true,
  //   getPage: true,
  //   getCurrentPages: true,
  //   requirePlugin: true,
  //   set: true,
  // },
  // settings: {
  //   'import/resolver': {
  //     webpack: {
  //       config: path.join(__dirname, '/webpack.config.js'),
  //     },
  //   },
  // },
};