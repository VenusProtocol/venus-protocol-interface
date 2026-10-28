import { t } from 'libs/translations';
import type { RestServiceInput } from 'utilities/restService';

import { useStore } from '../store';
import { displayNotification } from '../utilities';

const SERVICE_ISSUE_NOTIFICATION_ID = 'service-issue';

let lastDisplayedPagePath: string | undefined;

export interface ServiceIssueDetails extends Pick<RestServiceInput, 'method' | 'endpoint'> {
  status: number;
  error?: string;
}

export const displayServiceIssueNotification = (details?: ServiceIssueDetails) => {
  const [pagePath] = window.location.hash.split('?');
  const { notifications } = useStore.getState();
  const isAlreadyDisplayed = notifications.some(
    notification => notification.id === SERVICE_ISSUE_NOTIFICATION_ID,
  );
  const isSamePage = pagePath === lastDisplayedPagePath;

  // Pages reached while the toast is up count as shown
  lastDisplayedPagePath = pagePath;

  if (isSamePage || isAlreadyDisplayed) {
    return;
  }

  displayNotification({
    id: SERVICE_ISSUE_NOTIFICATION_ID,
    variant: 'error',
    title: t('errors.serviceIssueTitle'),
    description: details ? (
      <div className="space-y-1">
        <p>{t('errors.serviceIssue')}</p>

        <details>
          <summary className="cursor-pointer text-grey">{t('errors.serviceIssueDetails')}</summary>

          <p className="break-all text-grey">
            {details.method} {details.endpoint} · {details.status}
          </p>

          {!!details.error && <p className="break-all text-grey">{details.error}</p>}
        </details>
      </div>
    ) : (
      t('errors.serviceIssue')
    ),
  });
};
