import fs from 'fs';
import fetch from 'node-fetch';

console.log('Hello world!');

const HASHNODE_PUBLICATION_ID = process.env.HASHNODE_PUBLICATION_ID;
const HASHNODE_TOKEN = process.env.HASHNODE_TOKEN;

if (!HASHNODE_PUBLICATION_ID || !HASHNODE_TOKEN) throw new Error('Environment variables missing.');

// E.g. articles/2023/nextjs-expo-monorepo.md
const articlePath = process.argv[2];
if (!articlePath) throw new Error('No article path provided.');

const content = fs.readFileSync(articlePath, 'utf-8');
// const titleRegex = /^# (.*)$/m;
const title = content.match(/^# (.*)$/m)?.[1];

if (!title) throw new Error('No title found in article.');

// todo cover image

const requestBody = {
  query: `mutation CreatePublicationStory {
            createPublicationStory(publicationId: "${HASHNODE_PUBLICATION_ID}", input: { title: "${title}", contentMarkdown: "${content}", tags: [] }) {
                code,
                success,
                message
            }
        }`,
};

const response = await fetch('https://api.hashnode.com', {
  method: 'POST',
  body: JSON.stringify(requestBody),
  headers: {
    'Content-Type': 'application/json',
    Authorization: HASHNODE_TOKEN,
  },
});
const responseBody = (await response.json()) as CreatePublicationStoryResponse;

if (responseBody.errors && responseBody.errors.length > 0)
  throw Error(responseBody.errors.map((e) => e.message).join(', '));

interface CreatePublicationStoryResponse {
  data: {
    createPublicationStory: {
      code: string;
      success: boolean;
      message: string;
    };
  };
  errors: [{ message: string }];
}
