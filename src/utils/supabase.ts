export const getImageUrl = (imagePath: string): string => {
  const { SUPABASE_URL, SUPABASE_STORAGE_BUCKET } = process.env;
  return `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/${getImageUploadPath(
    imagePath
  )}`;
};

export const getImageUploadPath = (imagePath: string): string => {
  return imagePath.split('/').slice(1).join('/');
};
