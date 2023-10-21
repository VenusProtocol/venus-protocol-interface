import { notificationStore } from 'stores/notifications';
import { AddNotificationInput, UpdateNotificationInput } from 'stores/notifications/types';
import Vi from 'vitest';

import { notifications as fakeNotifications } from '__mocks__/models/notifications';

import { MAX_NOTIFICATIONS, displayNotification, hideNotification, updateNotification } from '..';

const fakeNotificationInput: AddNotificationInput = {
  id: 99,
  description: 'Fake description',
};

const removeNotificationMock = vi.fn();
const addNotificationMock = vi.fn(() => fakeNotificationInput.id);
const updateNotificationMock = vi.fn();

vi.useFakeTimers();
vi.spyOn(global, 'setTimeout');

describe('notifications', async () => {
  beforeEach(() => {
    global.clearTimeout = vi.fn();

    vi.mock('stores/notifications', () => ({
      notificationStore: {
        getState: vi.fn(() => ({
          notifications: fakeNotifications,
          removeNotification: removeNotificationMock,
          addNotification: addNotificationMock,
          updateNotification: updateNotificationMock,
        })),
      },
    }));
  });

  describe('displayNotification', () => {
    it('adds notification to the store', () => {
      const newNotificationId = displayNotification(fakeNotificationInput);

      expect(newNotificationId).toBe(fakeNotificationInput.id);
      expect(notificationStore.getState().addNotification).toHaveBeenCalledTimes(1);
      expect(notificationStore.getState().addNotification).toHaveBeenCalledWith(
        fakeNotificationInput,
      );

      // Fast-forward until all timers have been executed
      vi.runAllTimers();

      expect(notificationStore.getState().removeNotification).toBeCalledTimes(1);
      expect(notificationStore.getState().removeNotification).toHaveBeenCalledWith({
        id: fakeNotificationInput.id,
      });
    });

    it('removes the last notification from the store when the maximum number of notifications allowed has been reached', () => {
      // Add maximum amount of notifications allowed to store
      const state = notificationStore.getState();
      (notificationStore.getState as Vi.Mock).mockImplementation(() => ({
        ...state,
        notifications: new Array(MAX_NOTIFICATIONS).fill(undefined).map((_, id) => ({
          id,
          description: `Fake description ${id}`,
        })),
      }));

      displayNotification({
        description: 'Fake description',
      });

      const { notifications } = notificationStore.getState();

      expect(notificationStore.getState().removeNotification).toHaveBeenCalledTimes(1);
      expect(notificationStore.getState().removeNotification).toHaveBeenCalledWith({
        id: notifications[notifications.length - 1].id,
      });
    });

    it('does not set a timeout to hide the notification if its variant is "loading"', () => {
      const customFakeNotificationInput: AddNotificationInput = {
        ...fakeNotificationInput,
        variant: 'loading',
      };
      const newNotificationId = displayNotification(customFakeNotificationInput);

      expect(newNotificationId).toBe(customFakeNotificationInput.id);
      expect(notificationStore.getState().addNotification).toHaveBeenCalledTimes(1);
      expect(notificationStore.getState().addNotification).toHaveBeenCalledWith(
        customFakeNotificationInput,
      );

      // Fast-forward until all timers have been executed
      vi.runAllTimers();

      expect(notificationStore.getState().removeNotification).not.toHaveBeenCalledWith(1);
    });
  });

  describe('hideNotification', () => {
    it('removes notification from store', () => {
      const fakeNotificationId = fakeNotifications[0].id;
      hideNotification({ id: fakeNotificationId });

      // Check hide timeout is cleared
      expect(global.clearTimeout).toHaveBeenCalledTimes(1);

      expect(notificationStore.getState().removeNotification).toHaveBeenCalledTimes(1);
      expect(notificationStore.getState().removeNotification).toHaveBeenCalledWith({
        id: fakeNotificationId,
      });
    });
  });

  describe('updateNotification', () => {
    it('updates notification in the store', () => {
      const fakeNotificationUpdate: UpdateNotificationInput = {
        ...fakeNotifications[0],
        title: 'New fake title',
        variant: 'success',
      };

      updateNotification(fakeNotificationUpdate);

      // Check hide timeout is cleared
      expect(global.clearTimeout).toHaveBeenCalledTimes(1);

      expect(notificationStore.getState().updateNotification).toHaveBeenCalledTimes(1);
      expect(notificationStore.getState().updateNotification).toHaveBeenCalledWith(
        fakeNotificationUpdate,
      );

      // Fast-forward until all timers have been executed
      vi.runAllTimers();

      expect(notificationStore.getState().removeNotification).toHaveBeenCalledTimes(1);
      expect(notificationStore.getState().removeNotification).toHaveBeenCalledWith({
        id: fakeNotificationUpdate.id,
      });
    });

    it('does not set a timeout to hide the notification if its variant is "loading"', () => {
      const customFakeNotificationInput: AddNotificationInput = {
        ...fakeNotificationInput,
        variant: 'loading',
      };
      const newNotificationId = displayNotification(customFakeNotificationInput);

      expect(newNotificationId).toBe(customFakeNotificationInput.id);
      expect(notificationStore.getState().addNotification).toHaveBeenCalledTimes(1);
      expect(notificationStore.getState().addNotification).toHaveBeenCalledWith(
        customFakeNotificationInput,
      );

      // Fast-forward until all timers have been executed
      vi.runAllTimers();

      expect(notificationStore.getState().removeNotification).not.toHaveBeenCalledWith(1);
    });
  });
});
