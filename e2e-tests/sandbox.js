"use strict";

const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("http://localhost:5000");
  await page.screenshot({ path: "test.png" });

  await browser.close();
})();
