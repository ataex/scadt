const path = require('path');

module.exports = {
	entry: {
		app: './src/main.js',
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, './build'),
		publicPath: '/',
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
