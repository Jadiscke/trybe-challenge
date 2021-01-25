const User = require("../../src/models/User");
const SEEDED_USER = {
  user: "testuser",
  password: "123456",
  email: "test@email.com",
  displayName: "atleast8name",
  image: "anyURL",
};
async function seedUser() {
  const seededUser = SEEDED_USER;
  const { id } = await User.create(seededUser);
  return {
    id,
    ...seededUser,
  };
}

module.exports = { seedUser, SEEDED_USER };
