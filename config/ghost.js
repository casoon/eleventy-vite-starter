require("dotenv").config();
const ghostContentAPI = require("@tryghost/content-api");

console.log(process.env.GHOST_CONTENT_API_KEY);

// Init Ghost API
const api = new ghostContentAPI({
    url: process.env.GHOST_API_URL,
    key: process.env.GHOST_CONTENT_API_KEY,
    version: "v2"
  });

  // Strip Ghost domain from urls
const stripDomain = url => {
  return url.replace(process.env.GHOST_API_URL, "");
};

// Collections
async function docs(collection) {
  collection = await api.pages
    .browse({
      include: "authors",
      limit: "all"
    })
    .catch(err => {
      console.error(err);
    });

  collection.map(doc => {
    doc.url = stripDomain(doc.url);
    doc.primary_author.url = stripDomain(doc.primary_author.url);

    // Convert publish date into a Date object
    doc.published_at = new Date(doc.published_at);
    return doc;
  });

  return collection;
}

async function posts(collection) {
  collection = await api.posts
    .browse({
      include: "tags,authors",
      limit: "all"
    })
    .catch(err => {
      console.error(err);
    });

  collection.forEach(post => {
    post.url = stripDomain(post.url);
    post.primary_author.url = stripDomain(post.primary_author.url);
    post.tags.map(tag => (tag.url = stripDomain(tag.url)));

    // Convert publish date into a Date object
    post.published_at = new Date(post.published_at);
  });

  // Bring featured post to the top of the list
  collection.sort((post, nextPost) => nextPost.featured - post.featured);

  return collection;
}

async function authors(collection) {
  collection = await api.authors
  .browse({
    limit: "all"
  })
  .catch(err => {
    console.error(err);
  });

  // Get all posts with their authors attached
  const posts = await api.posts
    .browse({
      include: "authors",
      limit: "all"
    })
    .catch(err => {
      console.error(err);
    });

  // Attach posts to their respective authors
  collection.forEach(async author => {
    const authorsPosts = posts.filter(post => {
      post.url = stripDomain(post.url);
      return post.primary_author.id === author.id;
    });
    if (authorsPosts.length) author.posts = authorsPosts;

    author.url = stripDomain(author.url);
  });

  return collection;
}

async function tags(collection) {
  collection = await api.tags
  .browse({
    include: "count.posts",
    limit: "all"
  })
  .catch(err => {
    console.error(err);
  });

  // Get all posts with their tags attached
  const posts = await api.posts
    .browse({
      include: "tags,authors",
      limit: "all"
    })
    .catch(err => {
      console.error(err);
    });

  // Attach posts to their respective tags
  collection.forEach(async tag => {
    const taggedPosts = posts.filter(post => {
      post.url = stripDomain(post.url);
      return post.primary_tag && post.primary_tag.slug === tag.slug;
    });
    if (taggedPosts.length) tag.posts = taggedPosts;

    tag.url = stripDomain(tag.url);
  });

  return collection;
}

module.exports.docs = docs;
module.exports.posts = posts;
module.exports.authors = authors;
module.exports.tags = tags;


