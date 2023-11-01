export const getSupabaseUrl = (path: string): string => {
  const { SUPABASE_URL, SUPABASE_STORAGE_BUCKET } = Bun.env;
  return `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/${getSupabaseUploadPath(
    path
  )}`;
};

export const getSupabaseUploadPath = (path: string): string => path.split('/').slice(1).join('/');
