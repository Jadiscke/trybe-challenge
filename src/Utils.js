class Utils {
  validateDisplayName(displayName) {
    return displayName.length > 8;
  }
  validateEmail(email) {
    const emailRegex = new RegExp(
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi
    );
    return emailRegex.test(email);
  }
  validateIfUserEntriesAreDefined(user) {
    const copyUser = {
      user: undefined,
      password: undefined,
      email: undefined,
      displayName: undefined,
      ...user,
    };
    const undefinedKeys = [];
    for (const key in copyUser) {
      if (!copyUser[key]) {
        undefinedKeys.push(key);
      }
    }
    if (!undefinedKeys.length) {
      return {
        valid: true,
        undefinedKeys,
      };
    }
    return {
      valid: false,
      undefinedKeys,
    };
  }
  validatePasswordLenght(password) {
    return password.length === 6;
  }

  formatUserList(users) {
    const formatedUsers = users.map((user) => {
      const safeUser = {
        ...user.dataValues,
      };
      safeUser.password = undefined;
      return safeUser;
    });

    return formatedUsers;
  }
}

module.exports = new Utils();
