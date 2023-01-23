declare global {
  namespace NodeJS {
    interface ProcessEnv {
      WEBSITE: string;
    }
  }
}

export {};
