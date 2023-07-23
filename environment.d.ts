declare global {
  namespace NodeJS {
    interface ProcessEnv {
      HASHNODE_URL: string;
      HASHNODE_PUBLICATION_ID: string;
      HASHNODE_TOKEN: string;
      DEV_TO_KEY: string;
      SUPABASE_URL: string;
      SUPABASE_KEY: string;
      SUPABASE_STORAGE_BUCKET: string;
    }
  }
}

export {};
