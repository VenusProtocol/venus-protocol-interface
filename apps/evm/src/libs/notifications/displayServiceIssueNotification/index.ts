import { t } from 'libs/translations';

import { displayNotification } from '../utilities';

const COOLDOWN_MS = 60000;

let lastDisplayedAtMs: number | undefined;

export const displayServiceIssueNotification = () => {
  const nowMs = Date.now();

  if (lastDisplayedAtMs !== undefined && nowMs - lastDisplayedAtMs < COOLDOWN_MS) {
    return;
  }

  lastDisplayedAtMs = nowMs;

  displayNotification({
    variant: 'error',
    description: t('errors.serviceIssue'),
  });
};
