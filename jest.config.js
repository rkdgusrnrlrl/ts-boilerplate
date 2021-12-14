module.exports = {
    testMatch: ['**/?(*.)+(spec|test).+(ts|js)'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    coverageReporters: ['text'],
    clearMocks: true,
    testTimeout: 50000,
};
