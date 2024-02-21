export interface CreateHashnodeArticleRequest {
  query: string;
  variables: {
    input: {
      publicationId: string;
      title: string;
      contentMarkdown: string;
      tags: { id: string }[];
      coverImageOptions: {
        coverImageURL: string;
      };
    };
  };
}
