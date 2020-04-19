"use strict";

const {
  signUp,
  signIn,
  signOut,
  resetBrowser,
} = require("../utils");

describe("create new user", () => {
  beforeAll(async () => {
    await resetBrowser();
  });

  it("should create user and login with it's credentials", async () => {
    // create new user
    const user = await signUp();

    // make sure user was created
    await expect(page).toMatch(/my conversations/i);
    await expect(page).toMatch(user.firstName);

    // log out
    await signOut();

    // login
    await signIn(user.email, user.password);

    // make sure user could re-login
    await expect(page).toMatch(/my conversations/i);
    await expect(page).toMatch(user.firstName);
  });
});
