module.exports = {
    env: {
        'browser': true,
        'es6': true,
        'node': true
    },
    extends: 'eslint:recommended',
    parserOptions: {
        'sourceType': 'module',
    },
    rules: {
        'indent': ['error', 4],
        'linebreak-style': ['error', 'unix'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'no-unused-vars': ['warn', 'all'],
        'no-var': ['warn'],
        'no-console': 'off',
        'object-curly-spacing':['error','always'],
        'space-in-parens':[ 'error','always' ],
        'no-throw-literal': [ 'error' ], 
        'prefer-const': [ 'error', { 'destructuring': 'any', 'ignoreReadBeforeAssign': false } ],
        'padded-blocks': ['error', 'always']
    },
    ignorePatterns: [
        'node_modules',
        'src/dist'
    ],
    globals:{
        //'MyGlobal': true
    }
};

