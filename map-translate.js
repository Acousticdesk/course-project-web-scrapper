const realEstate = require("./translated-1677269804290.json");
const fs = require("fs");

fs.writeFileSync(
  `translated-${Date.now()}.json`,
  JSON.stringify(
    Object.entries(realEstate).map(([key, value]) => value),
    null,
    2
  )
);
