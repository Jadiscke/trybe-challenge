const db = require("../../src/db");
const Post = require("../../src/models/Post");
const SEEDED_POST = {
  title: "any normal title",
  content: "This is not a large content if you ask me",
  published: new Date(Date.now()).toISOString(),
  updated: new Date(Date.now()).toISOString(),
};
async function seedPost(userId) {
  try {
    const seededPost = {
      ...SEEDED_POST,
      userId: userId,
    };
    console.log(seededPost);
    const { id } = await Post.create(seededPost);
    return {
      id,
      ...seededPost,
    };
  } catch (error) {
    console.log(error);
  }
}

module.exports = { seedPost, SEEDED_POST };
