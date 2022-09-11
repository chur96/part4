module.exports = {
	'env': {
		'browser': true,
		'commonjs': true,
		'es2021': true,
		'node' : true,
		'jest' : true
	},
	'extends': [
		'eslint:recommended',
		'plugin:react/recommended'
	],
	'overrides': [
	],
	'parserOptions': {
		'ecmaVersion': 'latest'
	},
	'plugins': [
		'react'
	],
	'rules': {
		'indent': [
			'error',
			4
		],
		'linebreak-style': [
			'error',
			'windows'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		]
	}
}
