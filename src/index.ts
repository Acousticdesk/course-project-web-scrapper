import * as dotenv from "dotenv";
import fs from "fs";
dotenv.config();

import puppeteer from "puppeteer";

import { queryLinks } from "links/query";

(async () => {
  const browser = await puppeteer.launch({
    dumpio: true,
  });
  const page = await browser.newPage();

  await page.goto(process.env.WEBSITE);

  await page.waitForSelector("#search-results");

  fs.writeFileSync(
    "links.json",
    JSON.stringify(await queryLinks(page), null, 2)
  );

  await browser.close();
})();
