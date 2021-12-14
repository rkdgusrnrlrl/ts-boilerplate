module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:jest/recommended', 'plugin:prettier/recommended'],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    rules: {
        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/no-use-before-define': [2, { 'functions': false }],
        '@typescript-eslint/ban-ts-ignore': 'off',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        'no-inner-declarations': 'off',
        'prettier/prettier': ['error', { 'endOfLine': 'auto' }],
    },
};
