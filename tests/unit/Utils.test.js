const { assert } = require("chai");
const Utils = require("../../src/Utils");

const VALID_USER = {
  id: "validID",
  password: "pass",
  email: "email@example.com",
  displayName: "DisplayName",
  image: "www.google.com",
};

const VALID_POST = {
  id: "validID",
  title: "valid Title",
  content: "valid Content",
  published: new Date(Date.now()).toISOString(),
  updated: new Date(Date.now()).toISOString(),
  userId: VALID_USER.id,
  user: VALID_USER,
};

describe("Utils", () => {
  describe("validateEmail", () => {
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
  });
  describe("validateIfUserEntriesAreDefined", () => {
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
        displayName: "DisplayName",
      };
      const expected = {
        valid: false,
        undefinedKeys: ["email"],
      };
      const isDefined = Utils.validateIfUserEntriesAreDefined(invalidUser);

      assert.deepStrictEqual(isDefined, expected);
    });
  });
  describe("formatUserList", () => {
    it("should format the users list", () => {
      const listOfUsers = [VALID_USER];
      const validUserWithoutPassword = {
        id: VALID_USER.id,
        email: VALID_USER.email,
        displayName: VALID_USER.displayName,
        image: VALID_USER.image,
      };

      const expected = [validUserWithoutPassword];
      const formatedUserList = Utils.formatUserList(listOfUsers);
      assert.deepStrictEqual(formatedUserList, expected);
    });
  });
  describe("validateDisplayName", () => {
    it("should return true if displayName length is greater than 8", () => {
      const displayName = "Test Dispay Name";
      const expected = true;

      const isValidDisplayName = Utils.validateDisplayName(displayName);
      assert.deepStrictEqual(isValidDisplayName, expected);
    });
  });
  describe("validatePasswordLength", () => {
    it("should validate password lenght", () => {
      const password = "123456";
      const expected = true;

      const isValidPassword = Utils.validatePasswordLenght(password);

      assert.deepStrictEqual(isValidPassword, expected);
    });
  });
  describe("validateLoginInformation", () => {
    it("should validate login information and return true when login information is valid", () => {
      const expected = true;

      const loginInformation = {
        email: "valid@email.com",
        password: "123456",
      };
      const { valid } = Utils.validateLoginInformation(loginInformation);

      assert.deepStrictEqual(valid, expected);
    });
    it("should return false when missing email or password in login information", () => {
      const expected = false;

      const loginInformationWithoutEmail = {
        password: "123456",
      };

      const loginInformationWithoutPassword = {
        email: "valid@email.com",
      };

      const {
        valid: invalidWithoutEmail,
        message: invalidWithoutEmailMessage,
      } = Utils.validateLoginInformation(loginInformationWithoutEmail);
      const {
        valid: invalidWithoutPassword,
        message: invalidWithoutPasswordMessage,
      } = Utils.validateLoginInformation(loginInformationWithoutPassword);

      assert.deepStrictEqual(invalidWithoutEmail, expected);
      assert.deepStrictEqual(invalidWithoutEmailMessage, `"email" is required`);
      assert.deepStrictEqual(invalidWithoutPassword, expected);
      assert.deepStrictEqual(
        invalidWithoutPasswordMessage,
        `"password" is required`
      );
    });
    it("should return false when email or password are empty in login information", () => {
      const expected = false;

      const loginInformationWithEmptyEmail = {
        email: "",
        password: "123456",
      };

      const loginInformationWithEmptyPassword = {
        password: "",
        email: "valid@email.com",
      };

      const {
        valid: invalidWithEmptyEmail,
        message: invalidWithEmptyEmailMessage,
      } = Utils.validateLoginInformation(loginInformationWithEmptyEmail);
      const {
        valid: invalidWithEmptyPassword,
        message: invalidWithEmptyPasswordMessage,
      } = Utils.validateLoginInformation(loginInformationWithEmptyPassword);

      assert.deepStrictEqual(invalidWithEmptyEmail, expected);
      assert.deepStrictEqual(
        invalidWithEmptyEmailMessage,
        `"email" is not allowed to be empty`
      );
      assert.deepStrictEqual(invalidWithEmptyPassword, expected);
      assert.deepStrictEqual(
        invalidWithEmptyPasswordMessage,
        `"password" is not allowed to be empty`
      );
    });
  });
  describe("formatPostList", () => {
    it("should format a post list", () => {
      const listOfPosts = [VALID_POST];
      const { password, ...safeUser } = {
        ...VALID_USER,
      };
      const { userId, ...expected } = {
        ...VALID_POST,
        user: safeUser,
      };
      const expectedArray = [expected];
      const formatedPosts = Utils.formatPostList(listOfPosts);

      assert.deepStrictEqual(formatedPosts, expectedArray);
    });
  });
  describe("formatPost", () => {
    it("should format post", () => {
      const { password, ...safeUser } = {
        ...VALID_USER,
      };
      const { userId, ...expected } = {
        ...VALID_POST,
        user: safeUser,
      };
      const formatedPost = Utils.formatPost(VALID_POST);
      assert.deepStrictEqual(formatedPost, expected);
    });
  });
});
