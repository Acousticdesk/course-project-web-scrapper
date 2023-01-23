import { Page } from "puppeteer";
import {
  RealEstateItem,
  RealEstateItemAttributes,
} from "real-estate-item/interface";

export async function queryRealEstateItem(
  page: Page
): Promise<RealEstateItem | undefined> {
  const body = await page.$("body");

  return await body?.evaluate((body) => {
    const title = body.querySelector(".UIMainTitle")?.textContent?.trim();

    const developer = body.querySelector(
      ".BuildingContacts-developer-name span"
    )?.textContent;

    const attributes = [...body.querySelectorAll(".BuildingAttributes-info")];

    const attributesOfInterest = attributes.reduce<RealEstateItemAttributes>(
      (acc, attribute, index) => {
        const realEstateAttributes = {
          "0": "class",
          "3": "construction_technology",
          "4": "walls",
          "5": "insulation",
          "6": "heating",
          "8": "num_apartments",
          "9": "state",
          "10": "protected_area",
          "11": "parking",
        } as const;

        const attributeOfInterest: keyof RealEstateItemAttributes =
          realEstateAttributes[
            index as unknown as keyof typeof realEstateAttributes
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
