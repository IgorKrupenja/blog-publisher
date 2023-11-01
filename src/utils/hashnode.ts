export const getCanonicalUrl = (slug: string): string => `${Bun.env.HASHNODE_URL}/${slug}`;
