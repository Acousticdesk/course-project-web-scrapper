import { RealEstateItem } from "real-estate-item/interface";

export interface ApartmentBasicInformation {
  rooms: number | null;
  area: number | null;
  pricePerUnit: number | null;
  price: number | null;
  floor: number | null;
}

export interface Apartment extends RealEstateItem {
  rooms: number | null;
  area: number | null;
  price: number | null;
}
