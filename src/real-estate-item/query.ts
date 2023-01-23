import { Page } from "puppeteer";
import { RealEstateAttributes } from "real-estate-item/real-estate-attributes.entity";
import {
  RealEstateItem,
  RealEstateItemAttributes,
} from "real-estate-item/interface";

export async function queryRealEstateItem(
  page: Page
): Promise<RealEstateItem | undefined> {
  const body = await page.$("body");

  return await body?.evaluate((body) => {
    const title = body.querySelector(".UIMainTitle")?.textContent;

    const developer = body.querySelector(
      ".BuildingContacts-developer-name span"
    )?.textContent;

    const attributes = [...body.querySelectorAll(".BuildingAttributes-info")];

    const attributesOfInterest = attributes.reduce<RealEstateItemAttributes>(
      (acc, attribute, index) => {
        const attributeOfInterest: keyof RealEstateItemAttributes =
          RealEstateAttributes.map[
            index as unknown as keyof typeof RealEstateAttributes.map
          ];

        if (!attributeOfInterest) {
          return acc;
        }

        acc[attributeOfInterest] = attribute.querySelector(
          ".BuildingAttributes-value"
        )?.textContent;

        return acc;
      },
      {} as RealEstateItemAttributes
    );

    return {
      title,
      developer,
      attributes: attributesOfInterest,
    };
  });
}
