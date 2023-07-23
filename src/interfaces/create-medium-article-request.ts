export interface CreateMediumArticleRequest {
  title: string;
  contentFormat: 'markdown' | 'html';
  content: string;
  tags?: string[];
  canonicalUrl?: string;
  publishStatus?: 'draft' | 'public' | 'unlisted';
  notifyFollowers?: boolean;
}
