import * as dotenv from "dotenv";
import fs from "fs";
import { DatasetController } from "./files/dataset-controller";

dotenv.config();

import puppeteer, { unregisterCustomQueryHandler } from "puppeteer";

import { queryLinks } from "links/query";
import { ScrapperLink } from "links/interfaces";
import { Logger } from "logger/logger.entity";
import { queryRealEstateItem } from "real-estate-item/query";
import { queryApartments } from "apartments/query";
import { Apartment } from "apartments/interfaces";

(async () => {
  const browser = await puppeteer.launch({
    dumpio: true,
  });
  const page = await browser.newPage();

  let links: ScrapperLink[] = [];

  for (let i = 1; i <= Number(process.env.NUM_PAGES_TO_SCRAP); i++) {
    Logger.log(`Scrapping ${process.env.WEBSITE}?page=${i}...`);
    await page.goto(`${process.env.WEBSITE}?page=${i}`);
    await page.waitForSelector("#search-results");

    const linksOnPage = await queryLinks(page);

    if (linksOnPage) {
      links = links.concat(linksOnPage);
    }
    Logger.log("Done ✅");
  }

  fs.writeFileSync("links.json", JSON.stringify(links, null, 2));

  const realEstateDatasetController = new DatasetController(
    `real-estate-${Date.now()}.json`
  );

  realEstateDatasetController.write("[");

  for (let i = 0; i < links.length; i++) {
    if (i === Number(process.env.NUM_RESIDENCES_TO_SCRAP)) {
      break;
    }

    Logger.log(`Scrapping ${links[i].link}...`);
    await page.goto(links[i].link);
    await page.waitForSelector("body");

    const realEstateItem = await queryRealEstateItem(page);

    await page.goto(`${links[i].link}/планування`);

    const apartmentsBasicInformation = await queryApartments(page);

    const apartmentsOnPage = apartmentsBasicInformation
      ? apartmentsBasicInformation.map((apartmentBasicInformation) => {
          return {
            ...realEstateItem,
            ...apartmentBasicInformation,
          } as Apartment;
        })
      : [];

    for (
      let i = 0;
      i < Number(process.env.NUM_APARTMENTS_PER_RESIDENCE_TO_SCRAP);
      i += 1
    ) {
      const apartment = apartmentsOnPage[i];

      if (!apartment) {
        break;
      }

      realEstateDatasetController.write(`${JSON.stringify(apartment)}`);
      realEstateDatasetController.write(",");
    }
    Logger.log("Done ✅");
  }

  // fs.writeFileSync(
  //   `real-estate-${Date.now()}.json`,
  //   JSON.stringify(apartments, null, 2)
  // );

  realEstateDatasetController.write("]");
  realEstateDatasetController.end();
  await browser.close();
})();
