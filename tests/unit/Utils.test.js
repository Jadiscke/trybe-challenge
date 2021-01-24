const assert = require("assert");
const Utils = require("../../src/Utils");

const VALID_USER = {
  id: "validID",
  user: "user",
  password: "pass",
  email: "email@example.com",
  displayName: "DisplayName",
  image: "www.google.com",
};

describe("Utils", () => {
  it("should return true when e-mail is valid email", () => {
    const validEmail = "example@example.com";
    const expected = true;
    const isValid = Utils.validateEmail(validEmail);
    assert.deepStrictEqual(isValid, expected);
  });

  it("should return false when e-mail is not valid", () => {
    const invalidEmails = ["email", "@example", "email.com", "email@example"];
    const expected = false;
    for (const invalidEmail of invalidEmails) {
      const isValid = Utils.validateEmail(invalidEmail);
      assert.deepStrictEqual(isValid, expected);
    }
  });

  it("should return true if user entries are defined", () => {
    const validUser = {
      user: "user",
      password: "pass",
      email: "email@example.com",
      displayName: "DisplayName",
      image: "www.google.com",
    };
    const expected = true;
    const { valid: isDefined } = Utils.validateIfUserEntriesAreDefined(
      validUser
    );

    assert.deepStrictEqual(isDefined, expected);
  });
  it("should return false if user entries are not defined", () => {
    const invalidUser = {
      password: "pass",
      email: "email@example.com",
      displayName: "DisplayName",
    };
    const expected = {
      valid: false,
      undefinedKeys: ["user"],
    };
    const isDefined = Utils.validateIfUserEntriesAreDefined(invalidUser);

    assert.deepStrictEqual(isDefined, expected);
  });
  it("should format the users list", () => {
    const listOfUsers = [VALID_USER];
    const validUserWithoutPassword = {
      id: VALID_USER.id,
      user: VALID_USER.user,
      email: VALID_USER.email,
      displayName: VALID_USER.displayName,
      image: VALID_USER.image,
    };

    const expected = [validUserWithoutPassword];
    const formatedUserList = Utils.formatUserList(listOfUsers);
    assert.deepStrictEqual(formatedUserList, expected);
  });
});
