const R = require("ramda");
const { DateTime } = require("luxon");
const htmlmin = require("html-minifier");

const markdown = require("markdown-it")({
	html: true,
	breaks: true,
	linkify: true,
	typographer: true,
}).use(require("markdown-it-anchor"), {
	level: [2],
	permalink: false,
});

const parseDate = (str) => {
	if (str instanceof Date) {
		return str;
	}
	const date = DateTime.fromISO(str, { zone: "utc" });
	return date.toJSDate();
};

const isFavorited = R.hasPath(["data", "favorite"]);

module.exports = {
	markdownify: (str) => markdown.render(str),

	markdownify_inline: (str) => markdown.renderInline(str),

	strip_html: (str) =>
		str.replace(
			/<script.*?<\/script>|<!--.*?-->|<style.*?<\/style>|<.*?>/g,
			""
		),

	date_to_permalink: (obj) => {
		const date = parseDate(obj);
		return DateTime.fromJSDate(date).toFormat("yyyy/MM");
	},

	lowercase: (value) => {
		return value.toLowerCase();
	},

	htmlDateString: (obj) => {
		const date = parseDate(obj);
		return DateTime.fromJSDate(date).toFormat("yyyy-LL-dd");
	},

	date_formatted: (obj) => {
		const date = parseDate(obj);
		return DateTime.fromJSDate(date).toFormat("dd.MM.yyyy");
	},

	readableDate: (obj) => {
		const date = parseDate(obj);
		return DateTime.fromJSDate(date, { zone: "utc" }).toFormat(
			"dd LLL yyyy"
		);
	},

	permalink: (str) => str.replace(/\.html/g, ""),

	take: (arr, n = 1) => R.take(n, arr),

	favorites: (arr, n = 5) => {
		return R.compose(R.take(n), R.filter(isFavorited))(arr);
	},

	newsletterPosts: (arr) =>
		arr.filter((x) => x.data.tags && x.data.tags.includes("newsletter")),

	includes: (x, y) => R.includes(y, x),

	getReadingTime: (text) => {
		const wordsPerMinute = 200;
		const numberOfWords = text.split(/\s/g).length;
		return Math.ceil(numberOfWords / wordsPerMinute);
	},
};
