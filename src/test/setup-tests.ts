import { vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';

// export function setup(): void {
import.meta.env.HASHNODE_URL = 'https://blog.IgorKrpenja.com';
import.meta.env.SUPABASE_URL = 'https://supabase.IgorKrpenja.com';
import.meta.env.SUPABASE_STORAGE_BUCKET = 'images';

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();
// }

// export function teardown(): void {}
