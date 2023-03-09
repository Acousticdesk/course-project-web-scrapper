import realEstateDataset from "../../real-estate-1678304145096.json";
import fs from "fs";

// https://dom.ria.com/uk/novostroyki/tseny-kiev/
const priceStatisticsPerDistrict = {
  Дарницький: 42027,
  Дніпровський: 34392,
  Деснянський: 30949,
  Голосіївський: 52536,
  "Солом'янський": 37885,
  Святошинський: 47299,
  Оболонський: 89888,
  Подільський: 53927,
  Печерський: 136750,
  Шевченківський: 72634,
};

class PriceStatisticsMapper {
  static calculateExpectedPrice(dataset: typeof realEstateDataset) {
    return dataset.map((realEstateItem) => {
      let subjectDistrict;

      for (const district in priceStatisticsPerDistrict) {
        if (realEstateItem.district.match(district)) {
          subjectDistrict = district;
          break;
        }
      }

      return {
        ...realEstateItem,
        crimeRateInDistrict:
          // @ts-ignore
          priceStatisticsPerDistrict[subjectDistrict] || null,
      };
    });
  }
}

fs.writeFileSync(
  `real-estate-${Date.now()}.json`,
  JSON.stringify(
    PriceStatisticsMapper.calculateExpectedPrice(realEstateDataset),
    null,
    2
  )
);
