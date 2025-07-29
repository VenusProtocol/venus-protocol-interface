import type { CaptureResult } from 'posthog-js';

export const appendHash = (event: CaptureResult | null) => {
  let parsedUrl: URL | undefined;

  if (event?.properties?.$current_url) {
    parsedUrl = new URL(event.properties.$current_url);
  }

  // Append hash to the $pathname property
  if (event?.properties?.$current_url && parsedUrl) {
    event.properties.$pathname = parsedUrl.pathname + parsedUrl.hash;
  }

  return event;
};
