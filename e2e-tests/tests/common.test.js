"use strict";

const {
  goToHome,
  clickOnLink,
  resetBrowser,
} = require("../utils");

describe("common tests", () => {
  beforeAll(async () => {
    await resetBrowser();
  });

  it("should open website", async () => {
    await goToHome();
    await expect(page.url()).toMatch(/\/home$/);
    await expect(page).toMatch(/know what your organization is thinking/i);
  });

  it("should redirect to signin and home from navbar links", async () => {
    await goToHome();

    await clickOnLink(/sign in/i);
    await expect(page.url()).toMatch(/\/signin$/);
    await expect(page).toMatch(/sign in/i);

    await clickOnLink(/logo for polis/i);
    await expect(page.url()).toMatch(/\/home$/);
    await expect(page).toMatch(/know what your organization is thinking/i);
  });
});
