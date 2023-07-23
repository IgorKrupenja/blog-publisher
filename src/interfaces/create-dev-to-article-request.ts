export interface CreateDevToArticleRequest {
  title: string;
  body_markdown: string;
  published?: boolean;
  main_image?: string;
  canonical_url?: string;
  description?: string;
  tags: string[];
}
