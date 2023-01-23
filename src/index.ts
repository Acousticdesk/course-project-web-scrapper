import * as dotenv from "dotenv";
import fs from "fs";
dotenv.config();

import puppeteer from "puppeteer";
import chalk from "chalk";

import { queryLinks } from "links/query";
import { ScrapperLink } from "links/interfaces";

(async () => {
  const browser = await puppeteer.launch({
    dumpio: true,
  });
  const page = await browser.newPage();

  let links: ScrapperLink[] = [];

  for (let i = 1; i <= Number(process.env.NUM_PAGES_TO_SCRAP); i++) {
    await page.goto(`${process.env.WEBSITE}?page=${i}`);
    await page.waitForSelector("#search-results");

    const linksOnPage = await queryLinks(page);

    if (linksOnPage) {
      links = links.concat(linksOnPage);
    }
  }

  fs.writeFileSync("links.json", JSON.stringify(links, null, 2));

  await browser.close();
})();
