const path = require("path");

module.exports = {
	webpack: {
		alias: {
			react: path.resolve(__dirname, "./node_modules/react")
		}
	},
	entry: "./src/index.js",
	mode: "development",
	module: {
		rules: [
			//...
			{
				test: /\.svg$/,
				use: [
					{
						loader: "file-loader",
						options: {
							name: path.join(__dirname, "assets/[hash]-[name].[ext]")
						}
					}
				]
			}
		]
	},
	babel: {
		plugins: ["@babel/plugin-transform-react-jsx"]
	}
};
