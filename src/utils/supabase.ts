export const getImageUrl = (coverImagePath: string): string => {
  const { SUPABASE_URL, SUPABASE_STORAGE_BUCKET } = process.env;
  return `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/${coverImagePath
    .split('/')
    .slice(1)
    .join('/')}`;
};
