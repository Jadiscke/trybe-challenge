const User = require("../../src/models/User");

async function seedUser(models) {
  const seededUser = {
    user: "testuser",
    password: "pass",
    email: "test@email.com",
    displayName: "atleast8name",
    image: "anyURL",
  };
  const { id } = await User.create(seededUser);
  return {
    id,
    ...seededUser,
  };
}

module.exports = seedUser;
