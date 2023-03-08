import axios from "axios";
import * as dotenv from "dotenv";
import fs from "fs";
import realEstateDataset from "../../real-estate-1678300661746.json";

dotenv.config();

const memo = {};

class DirectionsMapper {
  static KYIV_CITY_CENTER_DESTINATION = "метро Хрещатик";
  // It returns minutes required to get to the destination from origin
  static async calculateDirections(origin: string, destination: string) {
    console.log("was called");
    const originWithCity = `м. Київ, ${origin}, 02000`;
    const response = await axios.get<google.maps.DirectionsResult>(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
        originWithCity
      )}&destination=${encodeURIComponent(
        destination
      )}&mode=walking&language=en&key=${process.env.GOOGLE_DIRECTIONS_API_KEY}`
    );

    const seconds = response.data?.routes[0].legs[0].duration?.value;

    return seconds ? Math.floor(seconds / 60) : null;
  }

  static async calculateDirectionsForDataset(
    dataset: typeof realEstateDataset
  ) {
    const result = [];

    // sequential calls for proper memoization
    for (let i = 0; i < dataset.length; i += 1) {
      const realEstateItem = dataset[i];

      const minutesToCityCenter =
        // @ts-ignore
        memo[realEstateItem.address] ||
        (await DirectionsMapper.calculateDirections(
          realEstateItem.address,
          DirectionsMapper.KYIV_CITY_CENTER_DESTINATION
        ));

      // @ts-ignore
      memo[realEstateItem.address] = minutesToCityCenter;

      result.push({
        ...realEstateItem,
        minutesToCityCenter,
      });
    }

    return result;
  }
}

(async function () {
  const datasetWithDestinationToCityCenter =
    await DirectionsMapper.calculateDirectionsForDataset(realEstateDataset);

  fs.writeFileSync(
    `real-estate-${Date.now()}.json`,
    JSON.stringify(datasetWithDestinationToCityCenter, null, 2)
  );
})();
