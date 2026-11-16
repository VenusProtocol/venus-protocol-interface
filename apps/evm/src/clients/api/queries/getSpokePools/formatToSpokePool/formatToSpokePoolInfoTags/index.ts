import type { SpokePoolInfoTag } from 'types';

import type { ApiSpokePoolTag } from '../../types';

const isHttpsUrl = (url?: string | null): url is string => {
  if (!url) {
    return false;
  }

  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
};

export const formatToSpokePoolInfoTags = (apiTags: ApiSpokePoolTag[] = []): SpokePoolInfoTag[] =>
  apiTags
    .filter(apiTag => apiTag.type === 'info' && !!apiTag.content)
    .sort((tagA, tagB) => (tagA.order ?? 0) - (tagB.order ?? 0))
    .map(apiTag => ({
      title: apiTag.title ?? undefined,
      content: apiTag.content ?? {},
      url: isHttpsUrl(apiTag.url) ? apiTag.url : undefined,
      urlLabel: apiTag.urlLabel ?? undefined,
    }));
