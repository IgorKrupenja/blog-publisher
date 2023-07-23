import fetch from 'node-fetch';

import {
  Article,
  CreateDevToArticleRequest,
  CreateDevToArticleResponse,
} from '../interfaces/index.js';
import { getCoverImageUrl, insertCanonicalUrl } from '../utils/index.js';

export const publishArticleOnDevTo = async (article: Required<Article>): Promise<void> => {
  const response = await fetch('https://dev.to/api/articles', {
    method: 'POST',
    headers: {
      'api-key': process.env.DEV_TO_KEY,
      accept: 'application/vnd.forem.api-v1+json',
      'content-type': 'application/json',
    },
    body: JSON.stringify(getCreateDevToArticleRequest(article)),
  });
  const responseJson = (await response.json()) as CreateDevToArticleResponse;

  if (responseJson.error) throw new Error(`Dev.to: ${responseJson.status} ${responseJson.error}`);

  console.log(`Dev.to: published draft article '${article.title}'`);
};

const getCreateDevToArticleRequest = ({
  content,
  canonicalUrl,
  coverImagePath,
  tags,
  title,
}: Required<Article>): CreateDevToArticleRequest => {
  if (tags.length > 4)
    console.warn('publishArticleOnDevTo: more than 4 tags, publishing only first 4');

  return {
    article: {
      title,
      body_markdown: insertCanonicalUrl(content, canonicalUrl),
      published: false,
      main_image: getCoverImageUrl(coverImagePath),
      canonical_url: canonicalUrl,
      tags: tags.map((tag) => tag.replace(/-/g, '')).slice(0, 4),
    },
  };
};
