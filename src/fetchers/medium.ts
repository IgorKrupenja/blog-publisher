import fetch from 'node-fetch';

import { Article, CreateMediumArticleRequest } from '../interfaces';
import { insertCanonicalUrl, insertCoverImage } from '../utils';

export const createMediumArticle = async (article: Required<Article>): Promise<void> => {
  const response = await fetch(
    `https://api.medium.com/v1/users/${process.env.MEDIUM_AUTHOR_ID}/posts`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.MEDIUM_INTEGRATION_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Charset': 'utf-8',
      },
      body: JSON.stringify(getCreateMediumArticleRequest(article)),
    }
  );

  if (response.status !== 201) throw Error(`Medium: ${response.status} ${response.statusText}`);

  console.debug(`Medium: published draft article '${article.title}'`);
};

const getCreateMediumArticleRequest = ({
  title,
  content,
  tags,
  canonicalUrl,
  coverImagePath,
}: Required<Article>): CreateMediumArticleRequest => {
  const contentWithCoverImage = insertCoverImage(title, content, coverImagePath);

  return {
    title,
    contentFormat: 'markdown',
    content: insertCanonicalUrl(contentWithCoverImage, canonicalUrl),
    tags: tags.map((tag) => tag.replace(/-/g, ' ')),
    canonicalUrl,
    publishStatus: 'draft',
    notifyFollowers: true,
  };
};
