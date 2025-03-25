import type { Notification } from '../types';

export interface AddNotificationInput extends Omit<Notification, 'onClose' | 'id'> {
  id?: string | number;
}

export interface UpdateNotificationInput extends Partial<Omit<Notification, 'onClose'>> {
  id: Notification['id'];
}

export interface RemoveNotificationInput {
  id: Notification['id'];
}

export interface StoreState {
  notifications: Notification[];
  addNotification: (input: AddNotificationInput) => Notification['id'];
  updateNotification: (input: UpdateNotificationInput) => void;
  removeNotification: (input: RemoveNotificationInput) => void;
}
