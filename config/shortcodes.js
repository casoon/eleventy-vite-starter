const Image = require("@11ty/eleventy-img");

module.exports = {
	link: function (url, text) {
		return "<a href='" + url + "'>" + text + " </a>";
	},
	image: async function (src, alt, width, height) {
		if (alt === undefined) {
			throw new Error(`Missing \`alt\` on myImage from: ${src}`);
		}

		let metadata = await Image(src, {
			widths: [null],
			formats: ["webp"],
			urlPath: "/assets/img/",
			outputDir: "./dist/assets/img/",
		});

		let data = metadata.webp[metadata.webp.length - 1];
		return `<img src="${data.url}" width="${width}" height="${height}" alt="${alt}" loading="lazy" decoding="async">`;
	}
};
