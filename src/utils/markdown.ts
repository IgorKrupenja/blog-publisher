import remarkFrontmatter from 'remark-frontmatter';
import remarkParse from 'remark-parse';
import remarkParseFrontmatter from 'remark-parse-frontmatter';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

import { ArticleFrontMatter } from '../interfaces';

import { getSupabaseUrl } from './supabase';

export const getArticleFrontMatter = (markdown: string): ArticleFrontMatter => {
  const parsedMarkdown = unified()
    .use(remarkParse)
    .use(remarkStringify)
    .use(remarkFrontmatter, 'yaml')
    .use(remarkParseFrontmatter)
    .processSync(markdown);

  const frontMatter = parsedMarkdown.data.frontmatter as Partial<ArticleFrontMatter> | undefined;

  if (!frontMatter) throw new Error('getArticle: No front matter found in article.');
  if (!frontMatter.title) throw new Error('getArticle: No title found in article.');
  if (!frontMatter.tags) throw new Error('getArticle: No tags found in article.');
  if (!frontMatter.coverImage) throw new Error('getArticle: No cover image found in article.');

  return frontMatter as ArticleFrontMatter;
};

/**
 * Return markdown content without front matter.
 *
 * @param markdown Markdown content with front matter.
 * @returns Markdown with front matter removed.
 */
export const getArticleContent = (markdown: string): string => {
  return markdown.replace(/---(.|\n)*---/, '').trim();
};

export const getCanonicalUrl = (slug: string): string => `${process.env.HASHNODE_URL}/${slug}`;

export const insertCanonicalUrl = (markdown: string, url: string): string => {
  const string = `\n*This article was originally published on [my blog](${url}).*\n`;
  return `${string}${markdown}`;
};

export const insertCoverImage = (
  title: string,
  markdown: string,
  coverImagePath: string
): string => {
  const string = `\n![${title}](${getSupabaseUrl(coverImagePath)})\n`;
  return `${string}${markdown}`;
};

export const getMarkdownImagePaths = (path: string, markdown: string): string[] => {
  const ast = unified().use(remarkParse).parse(markdown);

  const imagePaths: string[] = [];
  visit(ast, 'image', (node) => imagePaths.push(`${path}/${node.url}`));

  return [...new Set(imagePaths)];
};

export function replaceMarkdownImagePaths(path: string, markdown: string): string {
  const ast = unified().use(remarkParse).use(remarkFrontmatter, ['yaml', 'toml']).parse(markdown);

  visit(ast, 'image', (node) => {
    if (node.url.startsWith('http') || node.url.startsWith('data:')) return;
    node.url = `${path}${node.url.startsWith('/') ? '' : '/'}${node.url}`;
  });

  return unified()
    .use(remarkStringify)
    .use(remarkFrontmatter, ['yaml', 'toml'])
    .stringify(ast)
    .trim();
}
