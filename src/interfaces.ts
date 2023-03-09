export interface RealEstate {
  residence: string;
  developer: string;
  description: string;
  address: string;
  district: string;
  ceilingHeight: number;
  numApartmentsTotal: number;
  year: number;
  pricePerSquareMeter: number;
  price: number;
  area: number;
  rooms: number;
  floor: number;
  assess: number;
  crimeRateInDistrict: number;
  minutesToCityCenter: number;
}

export type Dataset = RealEstate[];
