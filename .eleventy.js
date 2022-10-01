require("dotenv").config();

const path = require('path');

const posts = require("./config/posts");
const filters = require("./config/filters");
const shortcodes = require("./config/shortcodes");
const transforms = require("./config/transforms");

const EleventyVitePlugin = require("@11ty/eleventy-plugin-vite");
const MinifyPlugin = require("./plugins/minifyPlugin");
const NavigationPlugin = require("@11ty/eleventy-navigation");
const AbsoluteUrlPlugin = require("./plugins/absoluteUrlPlugin");

module.exports = function (eleventyConfig) {

    // Filters
    Object.keys(filters).forEach((name) => {
        eleventyConfig.addFilter(name, filters[name]);
    });

    // Shortcodes
    Object.keys(shortcodes).forEach((name) => {
        eleventyConfig.addFilter(name, shortcodes[name]);
    });

    // Transforms
    Object.keys(transforms).forEach((transformName) => {
        eleventyConfig.addTransform(transformName, transforms[transformName])
    })

    // Posts
    Object.keys(posts).forEach((name) => {
        eleventyConfig.addCollection(name, posts[name]);
    });

    // Plugins
    eleventyConfig.addPlugin(AbsoluteUrlPlugin, { base: require("./data/metadata.json").url });
    eleventyConfig.addPlugin(NavigationPlugin);
    eleventyConfig.addPlugin(MinifyPlugin);

    // Layouts
    eleventyConfig.addLayoutAlias('default', 'layouts/default.njk');

    // Vite
    eleventyConfig.addPlugin(EleventyVitePlugin, {
        viteOptions: {
            assetsInclude: ['**/*.xml'],
            appType : "custom",
            resolve: {
                alias: {
                    '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
                }
            },
            clearScreen: false,
            server: {
                mode: "development",
                middlewareMode: true,
            },
            build: {
                mode: "production",
                emptyOutDir: true,
                rollupOptions: {
                    output: {
                        assetFileNames: 'assets/css/main.[hash].css',
                        chunkFileNames: 'assets/js/chunk.[hash].js',
                        entryFileNames: 'assets/js/main.[hash].js'
                    }
                }
            }
        }
    });

    eleventyConfig.setServerPassthroughCopyBehavior("copy");
    eleventyConfig.addPassthroughCopy({"public":"/"});
    eleventyConfig.setDataDeepMerge(true);

    return {
        templateFormats: ["njk"],
        dir: {
            input: "src",
            includes: "_includes",
            data: "_data",
            output: "_site",
        },
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        dataTemplateEngine: "njk",
        passthroughFileCopy: true

    };
    //
};
