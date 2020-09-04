var webpack = require("webpack"),
	CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin,
	config = require("../webpack.config");


config.plugins = [
	// clean the build folder
	new CleanWebpackPlugin(),
].concat(config.plugins);

webpack(
	config,
	function (err) { if (err) throw err; }
);
