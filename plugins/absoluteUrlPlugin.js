const { URL } = require("url");

module.exports = (eleventyConfig, pluginConfig) => {
	eleventyConfig.addFilter("absoluteUrl", function(url="", base=pluginConfig.base) {
		try {
			return new URL(url, base).href;
		} catch (err) {
			console.error(err);
			return url;
		}
	});
};
