const { assert } = require("chai");
const Authentication = require("../../src/Authentication");
const seedUser = require("../seeds/user.seed");

let seededUser;
let seededToken;

describe("Authentication", async () => {
  before(async () => {
    seededUser = await seedUser();
    seededToken = Authentication.generateToken(seededUser.id);
  });
  it("should generate a JWT", () => {
    const token = Authentication.generateToken(seededUser.id);

    assert.isDefined(token);
  });
  it("should decipher a JWT", () => {
    const expected = seededUser.id;

    const { id } = Authentication.decipherToken(seededToken);

    assert.deepStrictEqual(id, expected);
  });
});
