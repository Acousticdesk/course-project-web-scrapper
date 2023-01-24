export interface RealEstateItemAttributes {
  class: string | null | undefined;
  construction_technology: string | null | undefined;
  walls: string | null | undefined;
  insulation: string | null | undefined;
  heating: string | null | undefined;
  num_apartments: string | null | undefined;
  state: string | null | undefined;
  protected_area: string | null | undefined;
  parking: string | null | undefined;
}

export interface RealEstateItem {
  residence: string | null | undefined;
  developer: string | null | undefined;
  attributes: RealEstateItemAttributes;
}
