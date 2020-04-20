const nodeExternals = require('webpack-node-externals');
const path = require('path');
module.exports = {
	entry: './src/index.ts',
	mode: 'production',
	target: 'async-node',
	module: {
		rules: [{ test: /\.(ts|js)x?$/, loader: 'babel-loader', exclude: /node_modules/ }],
	},
	externals: [nodeExternals()],

	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'index.js',
	},
};
