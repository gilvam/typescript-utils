import eslint from '@eslint/js';
import * as tsEslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
	{
		// the flat config file itself isn't part of tsconfig's project — skip type-aware linting on it
		ignores: ['eslint.config.ts']
	},
	eslint.configs.recommended,
	...tsEslint.configs.recommended,
	...tsEslint.configs.recommendedTypeChecked,
	...tsEslint.configs.stylistic,
	{
		files: ['**/*.ts'],
		languageOptions: {
			parserOptions: {
				project: ['./tsconfig.json']
			}
		},
		plugins: { prettier: prettierPlugin },
		rules: {
			// typescript rules
			// '@typescript-eslint/comma-dangle': 'off',
			// '@typescript-eslint/lines-between-class-members': 'off',
			'@typescript-eslint/no-unsafe-enum-comparison': 'off',
			'@typescript-eslint/no-shadow': 'error',
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/no-unused-vars': 'error',
			'@typescript-eslint/no-namespace': 'error',
			'@typescript-eslint/no-empty-interface': 'error',
			'@typescript-eslint/no-empty-function': 'error',
			'@typescript-eslint/explicit-module-boundary-types': 'error',
			'@typescript-eslint/prefer-readonly': 'error',

			// prettier rules
			...eslintConfigPrettier.rules,
			'prettier/prettier': 'error',

			// other rules
			'no-param-reassign': 'error',
			camelcase: ['error', { allow: ['/^[_][A-Z0-9]*$/'] }]
		}
	}
];
