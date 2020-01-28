const { html } = require('common-tags');

module.exports = {

    Link: function (url, text) {
        return "<a href='" + url + "'>" + text + " </a>";
    }


};
