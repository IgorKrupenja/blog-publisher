import { getUrl } from './supabase';

const imageRegex = /!\[.*\]\((.*)\)/g;

export const insertCoverImage = (
  title: string,
  markdown: string,
  coverImagePath: string
): string => {
  const string = `\n![${title}](${getUrl(coverImagePath)})\n`;
  return `${string}${markdown}`;
};

export const insertCanonicalUrl = (markdown: string, url: string): string => {
  const string = `\n*This article was originally published on [my blog](${url}).*\n`;
  return `${string}${markdown}`;
};

export const getCanonicalUrl = (slug: string): string => {
  return `${process.env.HASHNODE_URL}/${slug}`;
};

export const getImagePaths = (path: string, markdown: string): string[] => {
  const matches = markdown.match(imageRegex);
  return matches ? matches.map((match) => replaceImagePaths(path, match)) : [];
};

export const replaceImagePaths = (path: string, markdown: string): string => {
  return markdown.replace(imageRegex, `${path}/$1`);
};
