const { translate } = require("@vitalets/google-translate-api");
import { Dataset } from "../interfaces";
const realEstateDataset: Dataset = require("../../real-estate-mapped.json");
const fs = require("fs");

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const memo = {};

(async function () {
  const translated = [];

  for (let i = 0; i < realEstateDataset.length; i += 1) {
    // The delay is used not to DOS Google API
    await delay(1000);
    const realEstateItem = realEstateDataset[i];

    // @ts-ignore
    const translation =
      memo[realEstateItem.residence] ||
      (await translate(realEstateItem.description, { to: "en" })).text;

    // @ts-ignore
    memo[realEstateItem.residence] = translation;

    translated.push({
      ...realEstateItem,
      description: translation,
    });
  }

  fs.writeFileSync(
    `real-estate-mapped.json`,
    JSON.stringify(translated, null, 2)
  );
})();
