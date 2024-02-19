# pubb

<!-- todo use similar in descr -->

Looking for a way to publish your developer blog posts to multiple platforms? Look no further! This
simple CLI tool provides an easy way to publish your blog posts on [Hashnode](https://hashnode.com/),
[Dev.to](https://dev.to/) and [Medium](https://medium.com/) and host images on
[Supabase](https://supabase.com/).

It is [beginner-friendly](#installation), [faster](#performance) and [more reliable](#testing) than
the alternatives.

⚠️ **Warning**: This tool is a work in progress, there are a couple of [limitations](#to-do) that
will be addressed in the nearest future.

## Installation

1. Install [Bun](https://bun.sh/) v1.0.25. Newer versions of Bun [have a bug with running tests](#to-do).

   ```sh
   # general approach
   curl -sSfL https://bun.sh | sh -s -- -v 1.0.25
   # alternative if using Homebrew
   brew install bun@1.0.25
   ```

2. Run `bun install` to install the dependencies.
3. Run `cp .env.example .env` and fill in the environment variables in the `.env` file. Namely:

   - Hashnode: [token](https://hashnode.com/settings/developer) and [publication ID and URL](https://hashnode.com/settings/blog).
   - Dev.to: [API key](https://dev.to/settings/extensions).
   - Medium: [integration token](https://medium.com/me/settings/security) and [publication ID](https://github.com/Medium/medium-api-docs#getting-the-authenticated-users-details). <!-- TODO: check where author ID is coming from. -->
   - Supabase: [get API key](https://supabase.com/dashboard/project/_/settings/api) and [create bucket](https://app.supabase.io/project/storage).

## Testing

<!-- todo BUN 🚀 -->

## Performance

<!-- todo BUN 🚀 -->

## To do

<!-- todo BUN 😢 -->
