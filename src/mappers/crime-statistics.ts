import { Dataset } from "../interfaces";
const realEstateDataset: Dataset = require("../../real-estate-mapped.json");
import fs from "fs";

// https://www.unian.ua/society/top-naykriminalnishih-rayoniv-kiyeva-u-policiji-rozpovili-de-naybilshe-vbivstv-u-kiyevi-novini-kiyeva-11331248.html
const crimeStatisticsPerDistrict = {
  Шевченківський: 4634,
  Дніпровський: 3939,
  "Солом'янський": 3860,
  Оболонський: 3524,
  Деснянський: 3022,
  Дарницький: 2999,
  Святошинський: 2884,
  Печерський: 2537,
  Голосіївський: 2317,
  Подільський: 2106,
};

class PriceStatisticsMapper {
  static calculateExpectedPrice(dataset: typeof realEstateDataset) {
    return dataset.map((realEstateItem) => {
      let subjectDistrict;

      for (const district in crimeStatisticsPerDistrict) {
        if (realEstateItem.district.match(district)) {
          subjectDistrict = district;
          break;
        }
      }

      return {
        ...realEstateItem,
        crimeRateInDistrict:
          // @ts-ignore
          crimeStatisticsPerDistrict[subjectDistrict] || null,
      };
    });
  }
}

fs.writeFileSync(
  `real-estate-mapped.json`,
  JSON.stringify(
    PriceStatisticsMapper.calculateExpectedPrice(realEstateDataset),
    null,
    2
  )
);
