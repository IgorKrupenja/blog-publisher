import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import mime from 'mime';

export const uploadCoverImage = async (coverImagePath: string): Promise<void> => {
  const { SUPABASE_URL, SUPABASE_KEY, SUPABASE_STORAGE_BUCKET } = process.env;

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

  const { error } = await supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .upload(coverImagePath, fs.readFileSync(coverImagePath), getCoverImageOptions(coverImagePath));

  if (error) throw new Error(`uploadCoverImage: ${JSON.stringify(error)}`);
  console.log(`uploadCoverImage: uploaded image '${coverImagePath}'`);
};

const getCoverImageOptions = (
  coverImagePath: string
): { cacheControl: string; contentType: string } => {
  return {
    cacheControl: '604800',
    contentType: mime.getType(coverImagePath) ?? 'image/jpg',
  };
};
