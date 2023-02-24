const { translate } = require("@vitalets/google-translate-api");
const realEstate = require("./real-estate-1677267283070.json");
const fs = require("fs");

function delay(ms) {
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

  translated = [];

  for (const promise of promises) {
    await delay(1000);
    translated.push(await promise);
  }

  fs.writeFileSync(
    `translated-${Date.now()}.json`,
    JSON.stringify(translated, null, 2)
  );
})();
