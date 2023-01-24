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
    const residence = body.querySelector(".UIMainTitle")?.textContent?.trim();

    const developer = body.querySelector(
      ".BuildingContacts-developer-name span"
    )?.textContent;

    const attributes = [...body.querySelectorAll(".BuildingAttributes-info")];

    const attributesOfInterest = attributes.reduce<RealEstateItemAttributes>(
      (acc, attribute) => {
        const realEstateAttributesMap = {
          клас: "class",
          "технологія будівництва": "construction_technology",
          стіни: "walls",
          утеплення: "insulation",
          опалення: "heating",
          "кількість квартир": "num_apartments",
          "стан квартири": "state",
          "закрита територія": "protected_area",
          паркінг: "parking",
        } as const;

        const currentAttribute = attribute
          .querySelector(".BuildingAttributes-name")
          ?.textContent?.toLowerCase();

        if (currentAttribute && currentAttribute in realEstateAttributesMap) {
          const currentAttributeTyped =
            currentAttribute as (typeof realEstateAttributesMap)[keyof typeof realEstateAttributesMap];
          acc[currentAttributeTyped] = attribute.querySelector(
            ".BuildingAttributes-value"
          )?.textContent;
        }

        return acc;
      },
      {} as RealEstateItemAttributes
    );

    return {
      residence,
      developer,
      attributes: attributesOfInterest,
    };
  });
}
