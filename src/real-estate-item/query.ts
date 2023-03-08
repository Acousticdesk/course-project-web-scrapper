import { Page } from "puppeteer";
import {
  RealEstateItem,
  RealEstateItemAttributes,
} from "real-estate-item/interface";
import { getApartmentAttributes, getApartmentYear } from "./query-slices";

export async function queryRealEstateItem(
  page: Page
): Promise<RealEstateItem | undefined> {
  const body = await page.$("body");

  const realEstateItem = await body?.evaluate(async (body) => {
    const residence = body.querySelector(".UIMainTitle")?.textContent?.trim();

    const developer = body.querySelector(
      ".BuildingContacts-developer-name span"
    )?.textContent;

    const address = body.querySelector(
      "#location .UISubtitle .UISubtitle-content"
    )?.textContent;

    const district = document
      .querySelector(".BuildingContacts-breadcrumbs")
      ?.textContent?.replace("Київ", "")
      .trim();

    const descriptionElement = body.querySelector(".BuildingDescription-text");

    const description = descriptionElement
      ? descriptionElement.textContent?.trim().replace(/[\n\t]/g, "")
      : "";

    // TODO akicha: also add average per district based on the table https://dom.ria.com/uk/novostroyki/tseny-kiev/

    // TODO akicha: Sometimes the developer is null, find out in which case this happens
    return {
      residence,
      developer,
      description,
      address,
      district,
    };
  });

  const attributes = (await body?.evaluate(
    getApartmentAttributes
  )) as RealEstateItemAttributes;
  //
  // const financials = (await body?.evaluate(
  //   getApartmentFinancialDetails
  // )) as RealEstateItemFinancials;

  const year = await body?.evaluate(getApartmentYear);

  return {
    ...realEstateItem,
    ...attributes,
    // financials,
    // @ts-ignore
    year,
  };
}
