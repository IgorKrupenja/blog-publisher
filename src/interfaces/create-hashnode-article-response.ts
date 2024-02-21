export interface CreateHashnodeArticleResponse {
  data?: {
    publishPost: {
      post: { slug: string };
    };
  };
  errors?: { message: string }[];
}
