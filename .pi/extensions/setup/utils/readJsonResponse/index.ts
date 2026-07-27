import { truncate } from '../truncate';

export const readJsonResponse = async (response: Response, label: string) => {
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${label} failed: ${response.status} ${response.statusText} ${truncate(text)}`);
  }

  if (!text.trim()) {
    return {};
  }

  return JSON.parse(text) as unknown;
};
