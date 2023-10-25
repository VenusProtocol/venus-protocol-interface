import { NoticeProps } from 'components/Notice/types';

export interface Notification extends Omit<NoticeProps, 'id'> {
  id: string | number;
}

export interface AddNotificationInput extends Omit<Notification, 'onClose' | 'id'> {
  id?: string | number;
}

export interface UpdateNotificationInput extends Partial<Omit<Notification, 'onClose'>> {
  id: Notification['id'];
}

export interface RemoveNotificationInput {
  id: Notification['id'];
}

export interface NotificationStoreState {
  notifications: Notification[];
  addNotification: (input: AddNotificationInput) => Notification['id'];
  updateNotification: (input: UpdateNotificationInput) => void;
  removeNotification: (input: RemoveNotificationInput) => void;
}
