export interface CreateHashnodeArticleResponse {
  data: {
    createPublicationStory: {
      post: { slug: string };
    };
  };
  errors?: { message: string }[];
}
