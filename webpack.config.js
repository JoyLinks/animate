const path = require('path');

module.exports = {
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		static: './',
	},
	entry: {
		main: './index.js'
	}
};