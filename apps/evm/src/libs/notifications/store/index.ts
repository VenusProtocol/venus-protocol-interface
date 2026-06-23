import { create } from 'zustand';

import { createStoreSelectors } from 'utilities/createStoreSelectors';

import type { Notification, StoreState } from '../types';

const useStore = create<StoreState>()(set => ({
  notifications: [],

  addNotification: input => {
    const id = input.id ?? Date.now();

    set(state => {
      const notification: Notification = {
        ...input,
        id,
        onClose: () =>
          state.removeNotification({
            id,
          }),
      };

      return {
        notifications: [notification, ...state.notifications],
      };
    });

    return id;
  },

  updateNotification: input =>
    set(state => ({
      notifications: state.notifications.map(notification =>
        notification.id === input.id ? { ...notification, ...input } : notification,
      ),
    })),

  removeNotification: ({ id }) =>
    set(state => ({
      notifications: state.notifications.filter(notification => notification.id !== id),
    })),
}));

export const store = createStoreSelectors(useStore);
