const dataset = require("./real-estate-1677267283070.json");
const fs = require("fs");

const result = dataset
  .filter((d) => !!d)
  .map((d) => {
    return {
      residence: d.residence,
      developer: d.developer,
      description: d.description,
      price: d.price,
      rooms: d.rooms,
    };
  });

fs.writeFileSync(
  `./real-estate-processed-${Date.now()}.json`,
  JSON.stringify(result, null, 2)
);
