import { Page } from "puppeteer";
import { ApartmentBasicInformation } from "apartments/interfaces";

export async function queryApartments(page: Page) {
  const body = await page.$("body");

  return await body?.evaluate((bodyElement) => {
    const planGrids = [...bodyElement.querySelectorAll(".Plans-grid")];

    return planGrids.reduce<ApartmentBasicInformation[]>((acc, planGrid) => {
      const planCards = [...planGrid.querySelectorAll(".PlansCard")];

      const appartments = planCards.map((planCard) => {
        const priceRaw = planCard
          .querySelector(".PlansCard-price")
          ?.textContent?.trim()
          ?.split("—")
          ?.map((price) => price.replace(/\s+/g, ""));

        // we need to use window, not global
        // this is because this function runs in browser
        const price = priceRaw
          ? (window.parseInt(priceRaw[0], 10) +
              window.parseInt(priceRaw[1], 10)) /
            2
          : null;

        const areaInformationRaw = planCard
          .querySelector(".PlansCard-area")
          ?.textContent?.trim();

        // meters squared
        const areaRaw = areaInformationRaw
          ? /(\d+.?\d+)\sм/g.exec(areaInformationRaw)?.[1]
          : null;
        const roomsRaw = areaInformationRaw
          ? /(\d)-кімнатна/g.exec(areaInformationRaw)?.[1]
          : null;

        const area = areaRaw ? window.parseInt(areaRaw, 10) : null;
        const rooms = roomsRaw ? window.parseInt(roomsRaw, 10) : null;

        return {
          price,
          area,
          rooms,
        };
      });

      return acc.concat(appartments);
    }, []);
  });
}
