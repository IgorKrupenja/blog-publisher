import fetch from 'node-fetch';

import { Article } from '../interfaces/article.js';
import { CreateMediumArticleRequest } from '../interfaces/create-medium-article-request.js';
import { insertCanonicalUrl, insertCoverImage } from '../utils/markdown.js';

export const publishArticleOnMedium = async ({
  title,
  content,
  tags,
  canonicalUrl,
  coverImagePath,
}: Required<Article>): Promise<void> => {
  const markdownWithCoverImage = insertCoverImage(title, content, coverImagePath);

  const requestBody: CreateMediumArticleRequest = {
    title,
    contentFormat: 'markdown',
    content: insertCanonicalUrl(markdownWithCoverImage, canonicalUrl),
    tags: tags.map((tag) => tag.replace(/-/g, ' ')),
    canonicalUrl,
    publishStatus: 'draft',
    notifyFollowers: true,
  };

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
      body: JSON.stringify(requestBody),
    }
  );

  if (response.status !== 201) throw Error(`Medium: ${response.status} ${response.statusText}`);

  console.log(`Medium: published draft article '${title}'`);
};
