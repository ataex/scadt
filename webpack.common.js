const path = require('path');

module.exports = {
	entry: {
		app: './src/main.js',
	},
	output: {
		filename: '[name].[hash].bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.less$/,
				use: ['style-loader', 'css-loader', 'less-loader'],
			},
		],
	},
};
