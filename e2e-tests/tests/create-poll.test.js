"use strict";

const {
  signUp,
  signIn,
  clickOn,
  resetBrowser,
} = require("../utils");

describe("create and consume poll", () => {
  beforeAll(async () => {
    await resetBrowser();
  });

  it("should create user poll", async () => {
    // create new user
    const user = await signUp();

    // create new poll
    await clickOn("span", /new/i);
  });
});
