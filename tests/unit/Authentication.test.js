const { assert } = require("chai");
const Authentication = require("../../src/Authentication");
const { seedUser, SEEDED_USER } = require("../seeds/user.seed");
const sinon = require("sinon");
const BIG_TIME = 18000000;
var clock;

describe("Authentication", async () => {
  before(async () => {
    clock = sinon.useFakeTimers();
    await seedUser();
  });

  after(() => {
    clock.restore();
  });
  it("should generate a JWT", async () => {
    const seededUser = SEEDED_USER;
    const token = Authentication.generateToken(seededUser.id);

    assert.isDefined(token);
  });
  it("should decipher a JWT", () => {
    const seededUser = SEEDED_USER;
    const expected = seededUser.id;
    const seededToken = Authentication.generateToken(seededUser.id);
    const decipheredToken = Authentication.decipherToken(seededToken);

    assert.deepStrictEqual(decipheredToken.id, expected);
  });

  it("should return undefined if JWT is undefined", () => {
    const token = undefined;
    const decipheredToken = Authentication.decipherToken(token);

    assert.isUndefined(decipheredToken);
  });

  it("should throw an error saying that the token expired", () => {
    const seededUser = SEEDED_USER;
    const expected = seededUser.id;
    const seededToken = Authentication.generateToken(seededUser.id);
    clock.tick(BIG_TIME);

    assert.throw(() => {
      const decipheredToken = Authentication.decipherToken(seededToken);
    });
  });
});
