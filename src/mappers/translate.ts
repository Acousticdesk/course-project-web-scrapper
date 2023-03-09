const { translate } = require("@vitalets/google-translate-api");
import { Dataset } from "../interfaces";
const realEstateDataset: Dataset = require("../../real-estate-mapped.json");
const fs = require("fs");

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

(async function () {
  const promises = realEstateDataset.map(async (value) => {
    if (!value) {
      return value;
    }
    return {
      ...value,
      description: (await translate(value.description, { to: "en" })).text,
    };
  });

  // parallel
  // const translated = await Promise.all(promises);

  // sequential
  const translated = [];

  for (const promise of promises) {
    await delay(1000);
    translated.push(await promise);
  }

  fs.writeFileSync(
    `real-estate-mapped.json`,
    JSON.stringify(translated, null, 2)
  );
})();
