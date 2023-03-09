const { translate } = require("@vitalets/google-translate-api");
import realEstate from "../../real-estate-1678302244580.json";
const fs = require("fs");

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

(async function () {
  const promises = realEstate.map(async (value) => {
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
    `real-estate-${Date.now()}.json`,
    JSON.stringify(translated, null, 2)
  );
})();
