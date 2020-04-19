"use strict";

module.exports = {
  launch: {
    slowMo: 100,
    dumpio: false,
    devtools: true,
    headless: process.env.HEADLESS !== "false",
    defaultViewport: {
      width: 1024,
      height: 768
    }
  }
};
