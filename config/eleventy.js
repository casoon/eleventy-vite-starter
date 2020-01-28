const filters = require('./filters');
const shortcodes = require('./shortcodes');
const posts = require('./posts');
//const ghost = require('./ghost');
const products = require('./products');


const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginNavigation = require("@11ty/eleventy-navigation");

const lazyImages = require("eleventy-plugin-lazyimages");
const localImages = require("eleventy-plugin-local-images");


module.exports = function (eleventyConfig) {
    // Filters
    Object.keys(filters).forEach(name => {
        eleventyConfig.addFilter(name, filters[name]);
    });

    // Shortcodes
    Object.keys(shortcodes).forEach(name => {
        eleventyConfig.addFilter(name, shortcodes[name]);
    });

    // Shortcodes
    Object.keys(posts).forEach(name => {
        eleventyConfig.addCollection(name, posts[name]);
    });

    // Ghost
    /*
    Object.keys(ghost).forEach(name => {
        eleventyConfig.addCollection(name, ghost[name]);
    });
    */

    // Copy images over from Ghost
    eleventyConfig.addPlugin(localImages, {
        distPath: "dist",
        assetPath: "/assets/images",
        selector: "img",
        attribute: "data-src", // Lazy images attribute
        verbose: false
    });

    // Products
    Object.keys(products).forEach(name => {
        eleventyConfig.addCollection(name, products[name]);
    });

    // Plugins
    eleventyConfig.addPlugin(pluginRss);
    eleventyConfig.addPlugin(pluginSyntaxHighlight);
    eleventyConfig.addPlugin(pluginNavigation);

    // Apply performance attributes to images
    eleventyConfig.addPlugin(lazyImages, {
        cacheFile: ""
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
