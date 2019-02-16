const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path');

module.exports = {
	entry: ['./src/index.js', './src/style.scss'],
	mode: 'development',
	module:{
		rules: [
			{
				test: /\.scss$/,
				exclude: /(node_modules|bower_components)/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					"sass-loader"
				]
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /(node_modules|bower_components)/,
				options:{
					"presets": ["@babel/preset-env"],
					"plugins": [
						["@babel/plugin-transform-async-to-generator"],
						["@babel/plugin-transform-runtime"]
					  ]
				}
			}	
		]
	},
	devtool: 'inline-source-map',
	plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
		}),
		new HtmlWebpackPlugin()
	],
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: true,
		hot: true,
		port: 8000
	}
}