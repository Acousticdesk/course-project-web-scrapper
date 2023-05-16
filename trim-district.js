const dataset = require("./real-estate-mapped.json");
const fs = require("fs");

fs.writeFileSync(
  "./real-estate-mapped-trimmed.json",
  JSON.stringify(
    dataset.map((d) => ({ ...d, district: d.district?.split("\n")[0] })),
    null,
    2
  )
);
