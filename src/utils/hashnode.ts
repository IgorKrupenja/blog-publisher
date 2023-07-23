import { HASHNODE_TAGS } from '../data/index.js';
import { HashnodeTag } from '../interfaces/index.js';

export const getHashNodeTags = (tags: string[]): HashnodeTag[] => {
  return tags.map((frontMatterTag) => {
    const hashNodeTag = HASHNODE_TAGS.find((tag) => tag.slug === frontMatterTag);
    if (hashNodeTag) return hashNodeTag;
    else throw new Error(`publishArticleOnHashnode: invalid tag: ${frontMatterTag}`);
  });
};
