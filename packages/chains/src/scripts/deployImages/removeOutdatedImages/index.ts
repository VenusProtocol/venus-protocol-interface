import { del, list } from '@vercel/blob';
import semver from 'semver';

const MAX_VERSIONS_TO_KEEP = 10;

export const removeOutdatedImages = async () => {
  // Collect all blobs, following pagination
  const allBlobs: Awaited<ReturnType<typeof list>>['blobs'] = [];
  let cursor: string | undefined;

  do {
    const result = await list({ cursor });
    allBlobs.push(...result.blobs);
    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);

  // Extract unique version prefixes from pathnames (first path segment)
  const versions = [...new Set(allBlobs.map(blob => blob.pathname.split('/')[0]))]
    // Filter out directories with non-semver names
    .filter(v => semver.valid(v))
    // Sort in descending order
    .sort((a, b) => semver.compare(b, a));

  // Remove outdated versions
  const versionsToRemove = versions.slice(MAX_VERSIONS_TO_KEEP);

  if (versionsToRemove.length === 0) {
    return;
  }

  const urlsToDelete = allBlobs
    .filter(blob => versionsToRemove.some(v => blob.pathname.startsWith(`${v}/`)))
    .map(blob => blob.url);

  await del(urlsToDelete);
};
