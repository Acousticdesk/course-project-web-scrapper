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
        const pricePerSquareMeter = priceRaw
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

        const price =
          pricePerSquareMeter && area ? pricePerSquareMeter * area : null;

        const floors = [
          ...planCard.querySelectorAll(".PlansCard-labels .UILabel"),
        ]
          .filter((label) => label.textContent?.match(/Поверхи:\s/g))
          .map((floorLabel) => {
            const text = floorLabel.textContent;

            if (text?.includes(",")) {
              const floors = text
                .replace("Поверхи: ", "")
                .split(",")
                .map((s) => s.trim());
              const result = floors.reduce(
                (acc, floor) => acc + Number(floor),
                0
              );
              return result ? Math.floor(result / floors.length) : null;
            }

            if (text?.includes("-")) {
              const floors = text
                .replace("Поверхи: ", "")
                .split("-")
                .map((s) => s.trim());
              const result = floors.reduce(
                (acc, floor) => acc + Number(floor),
                0
              );
              return result ? Math.floor(result / floors.length) : null;
            }

            const result = text?.match(/\d+/);

            return result ? Number(result) : null;
          });

        const floor = floors.length ? floors[0] : null;

        return {
          pricePerSquareMeter,
          price,
          area,
          rooms,
          floor,
        };
      });

      return acc.concat(appartments);
    }, []);
  });
}
