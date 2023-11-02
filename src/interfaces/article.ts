import { ArticleFrontMatter } from '.';

export interface Article extends Omit<ArticleFrontMatter, 'coverImage'> {
  content: string;
  coverImagePath: string;
  canonicalUrl?: string;
}
