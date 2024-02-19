const dayjs = require("dayjs");

// This is a little bit over engineered, but I _may_ want to filter by more than just year later down the line…
function getByDate(collection, dateFormat) {
  let postsByDate = {};
  // Update this to point to where you want to get your posts from:
  let posts = collection.getFilteredByGlob(["./src/posts/*.md", "./src/photos/*.md", "./src/bikes/*.md"]);
  posts.forEach(function (post) {
    // Get the year from the date
    let d = dayjs(post.data.date).format(dateFormat);
    // Create a new array key with the year
    if (!postsByDate[d]) {
      postsByDate[d] = new Array();
    }
    // Add the post to the year array key
    postsByDate[d].push(post);
  });
  return postsByDate;
}

// Create the new collection
exports.postsByYear = (collection) => {
  return getByDate(collection, "YYYY");
};