const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
	mode: 'production',
	plugins: [
		new CleanWebpackPlugin(['./docs']),
		new CopyWebpackPlugin([
			{
				from: './static/',
				to: './static/',
			},
		]),
		new HtmlWebpackPlugin({
			title: 'sCADt',
		}),
	],
});
