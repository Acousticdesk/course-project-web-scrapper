declare global {
  namespace NodeJS {
    interface ProcessEnv {
      WEBSITE: string;
      NUM_PAGES_TO_SCRAP: string;
      NUM_RESIDENCES_TO_SCRAP: string;
      NUM_APARTMENTS_PER_RESIDENCE_TO_SCRAP: string;
      GOOGLE_DIRECTIONS_API_KEY: string;
    }
  }
}

export {};
