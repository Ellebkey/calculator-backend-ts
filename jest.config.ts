import type {Config} from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
    verbose: true,
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleNameMapper: {
        '@config/(.*)': '<rootDir>/src/config/$1',
    },
};
export default config;
