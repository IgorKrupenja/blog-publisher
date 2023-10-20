import remarkFrontmatter from 'remark-frontmatter';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

import { getSupabaseUrl } from './supabase';

export const insertCoverImage = (
  title: string,
  markdown: string,
  coverImagePath: string
): string => {
  const string = `\n![${title}](${getSupabaseUrl(coverImagePath)})\n`;
  return `${string}${markdown}`;
};

export const insertCanonicalUrl = (markdown: string, url: string): string => {
  const string = `\n*This article was originally published on [my blog](${url}).*\n`;
  return `${string}${markdown}`;
};

export const getCanonicalUrl = (slug: string): string => {
  return `${process.env.HASHNODE_URL}/${slug}`;
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
    if (node.url.startsWith('http') || node.url.startsWith('data:')) {
      return;
    } else if (node.url.startsWith('/')) {
      node.url = `${path}${node.url}`;
    } else {
      node.url = `${path}/${node.url}`;
    }
  });

  const processedMarkdown = unified()
    .use(remarkStringify)
    .use(remarkFrontmatter, ['yaml', 'toml'])
    .stringify(ast)
    .trim();

  return processedMarkdown;
}
