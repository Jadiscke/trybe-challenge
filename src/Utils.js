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
    const formatedUsers = users.map(this.formatUser);

    return formatedUsers;
  }

  formatUser(user) {
    const { password, ...formatedUser } = {
      ...user,
    };
    return formatedUser;
  }

  formatPostList(posts) {
    const formatedPosts = posts.map(this.formatPost);

    return formatedPosts;
  }

  formatPost(post) {
    const user = post.user;
    const formatedUser = Utils.prototype.formatUser(user);
    const { userId, ...formatedPost } = {
      ...post,
      user: formatedUser,
    };

    return formatedPost;
  }

  validateLoginInformation(loginInformation) {
    loginInformation = {
      email: undefined,
      password: undefined,
      ...loginInformation,
    };
    for (const key in loginInformation) {
      if (Object.hasOwnProperty.call(loginInformation, key)) {
        const element = loginInformation[key];
        if (element === undefined)
          return { valid: false, message: `"${key}" is required` };
        if (!element.length)
          return {
            valid: false,
            message: `"${key}" is not allowed to be empty`,
          };
      }
    }
    return { valid: true };
  }

  validatePostInformation(postInformation) {
    postInformation = {
      title: undefined,
      content: undefined,
      ...postInformation,
    };
    for (const key in postInformation) {
      if (Object.hasOwnProperty.call(postInformation, key)) {
        const element = postInformation[key];
        if (element === undefined)
          return { valid: false, message: `"${key}" is required` };
        if (!element.length)
          return {
            valid: false,
            message: `"${key}" is not allowed to be empty`,
          };
      }
    }
    return { valid: true };
  }
}

module.exports = new Utils();
