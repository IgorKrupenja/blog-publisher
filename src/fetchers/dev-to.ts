import { Article, CreateDevToArticleRequest, CreateDevToArticleResponse } from '../interfaces';
import { insertCanonicalUrl } from '../utils/markdown';
import { getSupabaseUrl } from '../utils/supabase';

export const createDevToArticle = async (article: Required<Article>): Promise<void> => {
  const response = await fetch('https://dev.to/api/articles', {
    method: 'POST',
    headers: {
      'api-key': Bun.env.DEV_TO_KEY,
      accept: 'application/vnd.forem.api-v1+json',
      'content-type': 'application/json',
    },
    body: JSON.stringify(getCreateDevToArticleRequest(article)),
  });
  const responseJson = (await response.json()) as CreateDevToArticleResponse;

  if (responseJson.error) throw new Error(`Dev.to: ${responseJson.status} ${responseJson.error}`);

  console.debug(`Dev.to: published draft article '${article.title}'`);
};

export const getCreateDevToArticleRequest = ({
  content,
  canonicalUrl,
  coverImagePath,
  tags,
  title,
}: Required<Article>): CreateDevToArticleRequest => {
  if (tags.length > 4) console.warn('Dev.to: more than four tags, publishing only the first four.');

  return {
    article: {
      title,
      body_markdown: insertCanonicalUrl(content, canonicalUrl),
      published: false,
      main_image: getSupabaseUrl(coverImagePath),
      canonical_url: canonicalUrl,
      tags: tags.map((tag) => tag.replace(/-/g, '')).slice(0, 4),
    },
  };
};
