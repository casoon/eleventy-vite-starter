module.exports = {
	// Collections
	Posts: function (collection) {
		return collection.getFilteredByGlob("**/_posts/*.md").reverse();
	},
};
