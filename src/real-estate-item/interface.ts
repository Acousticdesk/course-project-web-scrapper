export interface RealEstateItemAttributes {
  class: string | null | undefined;
  // construction_technology: string | null | undefined;
  // walls: string | null | undefined;
  // insulation: string | null | undefined;
  // heating: string | null | undefined;
  // numApartmentsTotal: string | null | undefined;
  // ceilingHeight: string | null | undefined;
  // state: string | null | undefined;
  // protected_area: string | null | undefined;
  // parking: string | null | undefined;
}

// export interface RealEstateItemFinancials {
//   installmentPlan: boolean | null | undefined;
//   installmentPlanTerm: number | null | undefined;
// }

export interface RealEstateItem {
  residence: string | null | undefined;
  developer: string | null | undefined;
  address: string | null | undefined;
  attributes: RealEstateItemAttributes;
  // financials: RealEstateItemFinancials;
  description: string;
}
