import remarkFrontmatter from 'remark-frontmatter';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

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

// todo also use remark
export const getImagePaths = (path: string, markdown: string): string[] => {
  const matches = markdown.match(imageRegex);
  return matches ? matches.map((match) => replaceImagePaths(path, match)) : [];
};

export const replaceImagePaths = (path: string, markdown: string): string => {
  return markdown.replace(imageRegex, `${path}/$1`);
};

// export function replaceImagePathsNew(path: string, markdown: string): string {
//   const regex = /!\[(.*?)\]\((.*?)\)/g;

//   const replacedMarkdown = markdown.replace(regex, (match, p1: string, p2: string) => {
//     if (p2.startsWith('http') || p2.startsWith('data:')) {
//       return match;
//     } else if (p2.startsWith('/')) {
//       return `![${p1}](${path}${p2})`;
//     } else {
//       return `![${p1}](${path}/${p2})`;
//     }
//   });

//   return replacedMarkdown;
// }

export function replaceImagePathsNew(path: string, markdown: string): string {
  const ast = unified().use(remarkParse).use(remarkFrontmatter, ['yaml', 'toml']).parse(markdown);

  visit(ast, 'image', (node) => {
    console.log(node);
    if (node.url.startsWith('http') || node.url.startsWith('data:')) {
      return;
    } else if (node.url.startsWith('/')) {
      node.url = `${path}${node.url}`;
    } else {
      node.url = `${path}/${node.url}`;
    }
  });

  const mdx = unified()
    .use(remarkStringify)
    .use(remarkFrontmatter, ['yaml', 'toml'])
    .stringify(ast)
    .trim();

  // console.log(mdx);

  return mdx;
}
