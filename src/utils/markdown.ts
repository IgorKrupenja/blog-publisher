import { Article } from '../interfaces/index.js';

export const insertCoverImage = ({ title, content, coverImagePath }: Article): string => {
  const string = `\n![${title}](${getCoverImageUrl(coverImagePath)})\n`;
  return `${string}${content}`;
};

export const getCoverImageUrl = (coverImagePath: string): string => {
  const { SUPABASE_URL, SUPABASE_STORAGE_BUCKET } = process.env;
  return `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/${coverImagePath}`;
};

export const insertCanonicalUrl = (content: string, url: string): string => {
  const string = `\n*This article was originally published on [my blog](${url}).*\n`;
  return `${string}${content}`;
};

export const getCanonicalUrl = (slug: string): string => {
  return `${process.env.HASHNODE_URL}/${slug}`;
};
