const filters = require('./filters');
const shortcodes = require('./shortcodes');

const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginNavigation = require("@11ty/eleventy-navigation");


module.exports = function(eleventyConfig) {
  // Filters
  Object.keys(filters).forEach(name => {
    eleventyConfig.addFilter(name, filters[name]);
  });

  // Shortcodes
  Object.keys(shortcodes).forEach(name => {
    eleventyConfig.addFilter(name, shortcodes[name]);
  });

 // Plugins

  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(pluginNavigation);

  // Collections
  eleventyConfig.addCollection('posts', collection => {
    return collection.getFilteredByGlob('**/posts/*.md').reverse();
  });

  // Transforms
  eleventyConfig.addTransform('htmlmin', filters.htmlmin);

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
