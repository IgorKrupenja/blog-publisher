export const getUrl = (path: string): string => {
  const { SUPABASE_URL, SUPABASE_STORAGE_BUCKET } = process.env;
  return `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/${getUploadPath(
    path
  )}`;
};

// https://supabase.IgorKrpenja.com/storage/v1/object/public/images/articles/foo/

export const getUploadPath = (imagePath: string): string => {
  return imagePath.split('/').slice(1).join('/');
};
