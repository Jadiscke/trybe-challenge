const { assert } = require("chai");
const Authentication = require("../../src/Authentication");
const { seedUser, SEEDED_USER } = require("../seeds/user.seed");

let seededUser;
let seededToken;

describe("Authentication", async () => {
  before(async () => {
    await seedUser();
  });
  it("should generate a JWT", async () => {
    const seededUser = SEEDED_USER;
    seededToken = Authentication.generateToken(seededUser.id);
    const token = Authentication.generateToken(seededUser.id);

    assert.isDefined(token);
  });
  it("should decipher a JWT", async () => {
    const seededUser = SEEDED_USER;
    const expected = seededUser.id;

    const { id } = Authentication.decipherToken(seededToken);

    assert.deepStrictEqual(id, expected);
  });
});
