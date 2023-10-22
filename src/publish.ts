import 'dotenv/config';

import {
  createDevToArticle,
  createHashnodeArticle,
  createMediumArticle,
  uploadImage,
} from './fetchers';
import { Article } from './interfaces';
import {
  getArticleContent,
  getArticleCoverImagePath,
  getArticleFileString,
  getArticleFrontMatter,
  getCanonicalUrl,
  getMarkdownImagePaths,
  getSupabaseUrl,
  replaceMarkdownImagePaths,
} from './utils';

const publishArticle = async (): Promise<void> => {
  // E.g. articles/2023/01-nextjs-expo-monorepo
  const path = process.argv[2];

  //  todo name?
  const articleFile = getArticleFileString(path);

  const frontMatter = getArticleFrontMatter(articleFile);
  const imagePaths = getMarkdownImagePaths(path, articleFile);
  const coverImagePath = getArticleCoverImagePath(path, frontMatter.coverImage);
  const content = getArticleContent(articleFile);

  await Promise.all([coverImagePath, ...imagePaths].map(uploadImage));

  const article: Article = {
    ...frontMatter,
    content: replaceMarkdownImagePaths(getSupabaseUrl(path), content),
    coverImagePath: `${path}/${frontMatter.coverImage}`,
  };

  // TODO: temporary for testing
  const slug = await createHashnodeArticle(article);
  // const slug = 'nextjs-expo-monorepo-with-pnpm';
  const canonicalUrl = getCanonicalUrl(slug);

  await Promise.all([
    createDevToArticle({ ...article, canonicalUrl }),
    createMediumArticle({ ...article, canonicalUrl }),
  ]);
};

await publishArticle();
