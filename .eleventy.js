const { DateTime } = require('luxon');
const fs = require("fs");
const CleanCSS = require('clean-css');
const htmlmin = require('html-minifier');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginNavigation = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

module.exports = eleventyConfig => {

 // Plugins

  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(pluginNavigation);

  /* Markdown */
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true
  }).use(markdownItAnchor, {
    permalink: true,
    permalinkClass: "direct-link",
    permalinkSymbol: "#"
  });
  eleventyConfig.setLibrary("md", markdownLibrary);

  // Filters

  eleventyConfig.addFilter(
    'cssmin',
    code => new CleanCSS({}).minify(code).styles
  );

  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLL yyyy");
  });

  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj).toFormat('yyyy-LL-dd');
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if( n < 0 ) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  eleventyConfig.addFilter('markdownify', str => markdown.render(str));

  eleventyConfig.addFilter('markdownify_inline', str =>
    markdown.renderInline(str)
  );

  eleventyConfig.addFilter('strip_html', str => {
    return str.replace(
      /<script.*?<\/script>|<!--.*?-->|<style.*?<\/style>|<.*?>/g,
      ''
    );
  });

  const parseDate = str => {
    if (str instanceof Date) {
      return str
    }
    const date = DateTime.fromISO(str, { zone: 'utc' });
    return date.toJSDate()
  };

  eleventyConfig.addFilter('date_to_permalink', obj => {
    const date = parseDate(obj);
    return DateTime.fromJSDate(date).toFormat('yyyy/MM');
  });

  eleventyConfig.addFilter('date_formatted', obj => {
    const date = parseDate(obj);
    return DateTime.fromJSDate(date).toFormat('yyyy/MM/dd');
  });

  eleventyConfig.addFilter('date_to_med', obj => {
    const date = parseDate(obj);
    return DateTime.fromJSDate(date).toFormat('MMM yyyy');
  });

  eleventyConfig.addFilter('permalink', str => {
    return str.replace(/\.html/g, '');
  });


  // Minify HTML output
  eleventyConfig.addTransform('htmlmin', function(content, outputPath) {
    if (outputPath.indexOf('.html') > -1) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });

  eleventyConfig.setDataDeepMerge(true); 
  eleventyConfig.addPassthroughCopy('src/assets');

  return {
    templateFormats: ['njk', 'md', 'html'],
    dir: {
      input: 'src',
      includes: '_includes',
      data: 'data',
      output: 'dist'
    },
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    passthroughFileCopy: true
  };
};
