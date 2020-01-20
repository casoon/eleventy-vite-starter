const { html } = require('common-tags');
const markdown = require('markdown-it')({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
}).use(require('markdown-it-anchor'), {
  level: [2, 3],
  permalink: false,
});
const { hostname } = require('./filters');

module.exports = {
 
};
