const merge = require('webpack-merge');
const path = require('path');

const common = require('./webpack.common.js');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
	mode: 'production',
	output: {
		path: path.resolve(__dirname, './docs'),
		publicPath: './',
	},
	plugins: [
		new CleanWebpackPlugin(['./docs']),
		new CopyWebpackPlugin([
			{
				from: './static/',
				to: './',
			},
		]),
		new HtmlWebpackPlugin({
			title: 'sCADt',
		}),
	],
});
