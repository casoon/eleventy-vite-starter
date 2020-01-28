const R = require('ramda');
const htmlmin = require('html-minifier');
const CleanCSS = require('clean-css');
const Terser = require('terser');
const { DateTime } = require('luxon');
const markdown = require('markdown-it')({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
}).use(require('markdown-it-anchor'), {
    level: [2],
    permalink: false,
});

const parseDate = str => {
    if (str instanceof Date) {
        return str;
    }
    const date = DateTime.fromISO(str, { zone: 'utc' });
    return date.toJSDate();
};

const isFavorited = R.hasPath(['data', 'favorite']);

module.exports = {

    htmlmin: (content, outputPath) => {
        if (outputPath.indexOf('.html') > -1) {
            let minified = htmlmin.minify(content, {
                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true,
            });
            return minified;
        }
        return content;
    },

    cssmin: code => new CleanCSS({}).minify(code).styles,

    jsmin: code => {
        let minified = Terser.minify(code);
        if (minified.error) {
            console.log('Terser error: ', minified.error);
            return code;
        }
        return minified.code;
    },

    markdownify: str => markdown.render(str),

    markdownify_inline: str => markdown.renderInline(str),

    strip_html: str => str.replace(/<script.*?<\/script>|<!--.*?-->|<style.*?<\/style>|<.*?>/g, ''),

    date_to_permalink: obj => {
        const date = parseDate(obj);
        return DateTime.fromJSDate(date).toFormat('yyyy/MM');
    },

    htmlDateString: obj => {
        const date = parseDate(obj);
        return DateTime.fromJSDate(date).toFormat('yyyy-LL-dd');
    },

    date_formatted: obj => {
        const date = parseDate(obj);
        return DateTime.fromJSDate(date).toFormat('dd.MM.yyyy');
    },

    readableDate: obj => {
        const date = parseDate(obj);
        return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat("dd LLL yyyy");
    },


    permalink: str => str.replace(/\.html/g, ''),

    take: (arr, n = 1) => R.take(n, arr),

    favorites: (arr, n = 5) => {
        return R.compose(R.take(n), R.filter(isFavorited))(arr);
    },

    newsletterPosts: arr => arr.filter(x => x.data.tags && x.data.tags.includes('newsletter')),

    includes: (x, y) => R.includes(y, x),

    hostname: href => {
        const match = href.match(
            /^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/,
        );
        const hostUrl = match[3];
        return hostUrl.replace(/(?:www\.)?/g, '');
    },

    getReadingTime: text => {
        const wordsPerMinute = 200;
        const numberOfWords = text.split(/\s/g).length;
        return Math.ceil(numberOfWords / wordsPerMinute);
    },

};
