# Blog publisher

Looking for a way to publish your developer blog posts to multiple platforms? Look no further! This
simple and [reliable](#testing) CLI tool provides an easy way to publish your blog on [Hashnode](https://hashnode.com/),
[Dev.to](https://dev.to/) and [Medium](https://medium.com/) and host images on [Supabase](https://supabase.com/).

⚠️ **Warning**: This tool is a work in progress, there are a couple of [limitations](#to-do) that
will be addressed in the nearest future.

## Installation

1. Install [Bun](https://bun.sh/) v1.0.25. Newer versions of Bun [have a bug with tests](#to-do).
2. Run `bun install` to install the dependencies.
3. Run `cp .env.example .env` and fill in the environment variables in the `.env` file. Namely:

   - For Hashnode: [token](https://hashnode.com/settings/developer) and [publication ID and URL](https://hashnode.com/settings/blog).
   - For Dev.to: [API key](https://dev.to/settings/extensions).
   - Medium: [integration token](https://medium.com/me/settings/security) and [publication ID](https://medium.com/me/publications).

## Testing

## To do
