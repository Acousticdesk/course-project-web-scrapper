declare global {
  namespace NodeJS {
    interface ProcessEnv {
      WEBSITE: string;
      NUM_PAGES_TO_SCRAP: string;
      NUM_RESIDENCES_TO_SCRAP: string;
      NUM_APARTMENTS_TO_SCRAP: string;
    }
  }
}

export {};
