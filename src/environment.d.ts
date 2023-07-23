declare global {
  namespace NodeJS {
    interface ProcessEnv {
      HASHNODE_URL: string;
      HASHNODE_PUBLICATION_ID: string;
      HASHNODE_TOKEN: string;
      DEV_TO_KEY: string;
      MEDIUM_AUTHOR_ID: string;
      MEDIUM_INTEGRATION_TOKEN: string;
      SUPABASE_URL: string;
      SUPABASE_KEY: string;
      SUPABASE_STORAGE_BUCKET: string;
    }
  }
}

export {};
