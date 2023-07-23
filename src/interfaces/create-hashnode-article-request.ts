export interface CreateHashnodeArticleRequest {
  query: string;
  variables: {
    publicationId: string;
    hideFromHashnodeFeed?: boolean;
    input: {
      title: string;
      contentMarkdown: string;
      tags: { _id: string }[];
      isPartOfPublication: { publicationId: string };
      coverImageURL?: string;
    };
  };
}
