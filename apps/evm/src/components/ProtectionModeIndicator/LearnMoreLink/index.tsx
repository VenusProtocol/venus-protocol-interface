import { VENUS_PROTECTION_MODE_DOC_URL } from 'constants/production';

export const LearnMoreLink = (
  // biome-ignore lint/a11y/useAnchorContent: content is provided by Trans
  <a
    href={VENUS_PROTECTION_MODE_DOC_URL}
    className="text-blue underline"
    target="_blank"
    rel="noopener noreferrer"
  />
);
