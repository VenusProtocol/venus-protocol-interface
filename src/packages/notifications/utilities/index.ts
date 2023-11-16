import { store } from '../store';
import {
  AddNotificationInput,
  Notification,
  RemoveNotificationInput,
  UpdateNotificationInput,
} from '../store/types';

export const MAX_NOTIFICATIONS = 5;
const DISPLAY_TIME_MS = 9000;

const timeoutsMapping: {
  [notificationId: Notification['id']]: NodeJS.Timer;
} = {};

const setHideTimeout = ({
  id,
  variant,
}: {
  id: Notification['id'];
  variant: Notification['variant'];
}) => {
  const { removeNotification } = store.getState();

  // Automatically hide notification after a certain time if it's not of the variant "loading"
  if (variant !== 'loading') {
    timeoutsMapping[id] = setTimeout(() => removeNotification({ id }), DISPLAY_TIME_MS);
  }
};

export const hideNotification = ({ id }: RemoveNotificationInput) => {
  // Clear hide timeout if one was set
  clearTimeout(timeoutsMapping[id]);

  const { removeNotification } = store.getState();
  removeNotification({ id });
};

export const displayNotification = (input: AddNotificationInput) => {
  const { addNotification, notifications } = store.getState();

  // Remove last notification if we've reached the maximum allowed
  if (notifications.length >= MAX_NOTIFICATIONS) {
    hideNotification({ id: notifications[notifications.length - 1].id });
  }

  // Add notification to store
  const newNotificationId = addNotification(input);

  setHideTimeout({ id: newNotificationId, variant: input.variant });

  return newNotificationId;
};

export const updateNotification = (input: UpdateNotificationInput) => {
  // Clear hide timeout if one was set
  clearTimeout(timeoutsMapping[input.id]);

  const { updateNotification: updateStoreNotification } = store.getState();

  // Update notification
  updateStoreNotification(input);

  setHideTimeout({ id: input.id, variant: input.variant });
};
