"use strict";

jest.setTimeout(900000);

const faker = require("faker");
const BASE_URL = "http://localhost:5000";

module.exports.goTo = (url = "") => page.goto(`${BASE_URL}/${url}`, { waitUntil: "domcontentloaded" });
module.exports.goToSignUp = () => module.exports.goTo("createuser");
module.exports.goToSignIn = () => module.exports.goTo("signin");
module.exports.goToHome = () => module.exports.goTo();

module.exports.clickOn = async (element, text) => {
  await expect(page).toClick(element, { text, waitUntil: "domcontentloaded" });
  await page.waitForNavigation({ waitUntil: "domcontentloaded" });
}

module.exports.clickOnLink = text => module.exports.clickOn("a", text);
module.exports.clickOnButton = text => module.exports.clickOn("button", text);

module.exports.resetBrowser = async () => {
  await page.close();
  page = await context.newPage();
};

module.exports.signIn = async (email, password) => {
  await module.exports.goToSignIn();
  await expect(page).toFill("input[placeholder='email']", email);
  await expect(page).toFill("input[placeholder='password']", password);
  await module.exports.clickOnButton(/sign in/i);
};

module.exports.signUp = async () => {
  const [firstName, lastName] = [
    faker.name.firstName(),
    faker.name.lastName(),
  ];

  const [name, email, password] = [
    `${firstName} ${lastName}`,
    faker.internet.email(firstName, lastName).toLowerCase(),
    faker.internet.password(),
  ];

  await module.exports.goToSignUp();
  await expect(page).toFill("input[placeholder='name']", name);
  await expect(page).toFill("input[placeholder='email']", email);
  await expect(page).toFill("input[placeholder='password']", password);
  await expect(page).toFill("input[placeholder='repeat password']", password);
  await module.exports.clickOnButton(/create account/i);

  return { firstName, lastName, name, email, password };
}

module.exports.signOut = async () => {
  await clickOnLink(/sign out/i);
}
