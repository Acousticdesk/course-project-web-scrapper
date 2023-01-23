import { Page } from "puppeteer";
import { ScrapperLink } from "links/interfaces";

export async function queryLinks(
  page: Page
): Promise<ScrapperLink[] | undefined> {
  const grid = await page.$("#search-results > .UIGrid");

  return await grid?.evaluate((gridElement) => {
    const cards = [...gridElement.querySelectorAll(".Card")];

    return cards.map((card) => {
      const title = card.querySelector(".Card-title > h5")
        ?.textContent as string;
      const link = card
        .querySelector(".Card-link")
        ?.getAttribute("href") as string;

      return {
        title,
        link,
      };
    });
  });
}
