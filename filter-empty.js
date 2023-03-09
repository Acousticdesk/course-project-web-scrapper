const dataset = require("./real-estate-1678368250432.json");
const fs = require("fs");

fs.writeFileSync(
  "./real-estate-1678368250432.json",
  JSON.stringify(
    dataset.filter((d) => !!d),
    null,
    2
  )
);
