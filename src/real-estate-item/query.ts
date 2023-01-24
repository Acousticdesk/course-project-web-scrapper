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

    const attributeElements = [
      ...body.querySelectorAll(".BuildingAttributes-info"),
    ];

    const attributes = attributeElements.reduce<RealEstateItemAttributes>(
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

          acc[
            realEstateAttributesMap[
              currentAttributeTyped as keyof typeof realEstateAttributesMap
            ]
          ] = attribute.querySelector(".BuildingAttributes-value")?.textContent;
        }

        return acc;
      },
      {} as RealEstateItemAttributes
    );

    const financialsElement = body.querySelector("#credit_installments");

    let financials: {
      installmentPlan?: boolean;
      installmentPlanTerm?: number | null;
    } = {};

    if (financialsElement) {
      let installmentElement = null;
      let hasInstallmentPlan = false;

      [...financialsElement.querySelectorAll(".UICardLink-title")].forEach(
        (element) => {
          if (element.textContent?.toLowerCase()?.includes("розтермінування")) {
            installmentElement = element;
            hasInstallmentPlan = true;
          }
        }
      );

      if (installmentElement) {
        const installmentPlanDetailsRaw = (installmentElement as Element)
          .closest(".UICardLink-content")
          ?.querySelector(".UICardLink-description")
          ?.textContent?.trim();

        // на 1 рік, на 2 роки ...
        const installmentPlanDetails = installmentPlanDetailsRaw
          ? /на\s(\d)\sр/g.exec(installmentPlanDetailsRaw)?.[1]
          : null;

        financials.installmentPlan = true;
        financials.installmentPlanTerm = installmentPlanDetails
          ? window.parseInt(installmentPlanDetails, 10)
          : null;
      }
    }

    return {
      residence,
      developer,
      attributes,
      financials,
    };
  });
}
