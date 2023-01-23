import * as dotenv from "dotenv";
import fs from "fs";
dotenv.config();

import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({
    dumpio: true,
  });
  const page = await browser.newPage();

  const response = await page.goto(process.env.WEBSITE);

  if (response) {
    fs.writeFileSync("test.html", await response.text());
  }

  await page.waitForSelector("#search-results");

  const grid = await page.$("#search-results > .UIGrid");

  const links = await grid?.evaluate((gridElement) => {
    const cards = [...gridElement.querySelectorAll(".Card")];

    return cards.map((card) => {
      const title = card.querySelector(".Card-title > h5")?.textContent;
      const link = card.querySelector(".Card-link")?.getAttribute("href");

      return {
        title,
        link,
      };
    });
  });

  fs.writeFileSync("links.json", JSON.stringify(links, null, 2));

  await browser.close();
})();
