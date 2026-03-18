import pluginTs from '@typescript-eslint/eslint-plugin';
import parserTs from '@typescript-eslint/parser';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
    {
        files: ['**/*.ts'],
        ignores: ['**/dist/**', '**/node_modules/**'],
        languageOptions: {
            parser: parserTs,
            parserOptions: {
                project: ['./apps/*/tsconfig.json'],
                tsconfigRootDir: new URL('.', import.meta.url),
            },
        },
        plugins: {
            '@typescript-eslint': pluginTs,
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'warn',
        },
    },
];
