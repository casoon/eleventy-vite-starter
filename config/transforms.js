const htmlmin = require("html-minifier");

module.exports = {

	htmlmin: (content, outputPath) => {
		if (outputPath.indexOf(".html") > -1) {
			let minified = htmlmin.minify(content, {
				useShortDoctype: true,
				removeComments: true,
				collapseWhitespace: true,
			});
			return minified;
		}
		return content;
	},

};
