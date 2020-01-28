module.exports = {

    // Collections
    Products: function (collection) {
        return collection.getFilteredByGlob("_products/**/*.md");
    }

};
