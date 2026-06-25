import { store } from '../store';
import type {
  AddNotificationInput,
  Notification,
  RemoveNotificationInput,
  UpdateNotificationInput,
} from '../types';

export const MAX_NOTIFICATIONS = 5;
const DISPLAY_TIME_MS = 9000;

const timeoutsMapping: {
  [notificationId: Notification['id']]: NodeJS.Timer;
} = {};

const setHideTimeout = ({ id }: { id: Notification['id'] }) => {
  const { removeNotification } = store.getState();

  // Automatically hide notification after a certain time
  timeoutsMapping[id] = setTimeout(() => removeNotification({ id }), DISPLAY_TIME_MS);
};

export const hideNotification = ({ id }: RemoveNotificationInput) => {
  // Clear hide timeout if one was set
  clearTimeout(timeoutsMapping[id]);

  const { removeNotification } = store.getState();
  removeNotification({ id });
};

type DisplayNotificationInput = AddNotificationInput & {
  autoClose?: boolean;
};

export const displayNotification = ({
  autoClose = true,
  ...addNotificationInput
}: DisplayNotificationInput) => {
  const { addNotification, notifications } = store.getState();

  // Remove last notification if we've reached the maximum allowed
  if (notifications.length >= MAX_NOTIFICATIONS) {
    hideNotification({ id: notifications[notifications.length - 1].id });
  }

  // Add notification to store
  const newNotificationId = addNotification(addNotificationInput);

  if (autoClose) {
    setHideTimeout({ id: newNotificationId });
  }

  return newNotificationId;
};

type UpdateNotificationUtilInput = UpdateNotificationInput & {
  autoClose?: boolean;
};

export const updateNotification = ({
  autoClose = true,
  ...updateNotificationInput
}: UpdateNotificationUtilInput) => {
  // Clear hide timeout if one was set
  clearTimeout(timeoutsMapping[updateNotificationInput.id]);

  const { updateNotification: updateStoreNotification } = store.getState();

  // Update notification
  updateStoreNotification(updateNotificationInput);

  if (autoClose) {
    setHideTimeout({ id: updateNotificationInput.id });
  }
};
