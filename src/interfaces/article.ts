export interface Article {
  title: string;
  content: string;
  coverImagePath: string;
  tags: string[];
  canonicalUrl?: string;
}
