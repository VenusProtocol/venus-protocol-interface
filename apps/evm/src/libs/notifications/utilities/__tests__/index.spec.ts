import type { Mock } from 'vitest';

import { MAX_NOTIFICATIONS, displayNotification, hideNotification, updateNotification } from '..';
import { notifications as fakeNotifications } from '../../__mocks__/models/notifications';
import { store } from '../../store';
import type { AddNotificationInput, UpdateNotificationInput } from '../../store/types';

const fakeNotificationInput: AddNotificationInput = {
  id: 99,
  description: 'Fake description',
};

const removeNotificationMock = vi.fn();
const addNotificationMock = vi.fn(() => fakeNotificationInput.id);
const updateNotificationMock = vi.fn();

vi.spyOn(global, 'setTimeout');

describe('utilities', async () => {
  beforeEach(() => {
    vi.useFakeTimers();

    global.clearTimeout = vi.fn();

    vi.mock('../../store', () => ({
      store: {
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
      expect(store.getState().addNotification).toHaveBeenCalledTimes(1);
      expect(store.getState().addNotification).toHaveBeenCalledWith(fakeNotificationInput);

      // Fast-forward until all timers have been executed
      vi.runAllTimers();

      expect(store.getState().removeNotification).toBeCalledTimes(1);
      expect(store.getState().removeNotification).toHaveBeenCalledWith({
        id: fakeNotificationInput.id,
      });
    });

    it('removes the last notification from the store when the maximum number of notifications allowed has been reached', () => {
      // Add maximum amount of notifications allowed to store
      const state = store.getState();
      (store.getState as Mock).mockImplementation(() => ({
        ...state,
        notifications: new Array(MAX_NOTIFICATIONS).fill(undefined).map((_, id) => ({
          id,
          description: `Fake description ${id}`,
        })),
      }));

      displayNotification({
        description: 'Fake description',
      });

      const { notifications } = store.getState();

      expect(store.getState().removeNotification).toHaveBeenCalledTimes(1);
      expect(store.getState().removeNotification).toHaveBeenCalledWith({
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
      expect(store.getState().addNotification).toHaveBeenCalledTimes(1);
      expect(store.getState().addNotification).toHaveBeenCalledWith(customFakeNotificationInput);

      // Fast-forward until all timers have been executed
      vi.runAllTimers();

      expect(store.getState().removeNotification).not.toHaveBeenCalledWith(1);
    });
  });

  describe('hideNotification', () => {
    it('removes notification from store', () => {
      const fakeNotificationId = fakeNotifications[0].id;
      hideNotification({ id: fakeNotificationId });

      // Check hide timeout is cleared
      expect(global.clearTimeout).toHaveBeenCalledTimes(1);

      expect(store.getState().removeNotification).toHaveBeenCalledTimes(1);
      expect(store.getState().removeNotification).toHaveBeenCalledWith({
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

      expect(store.getState().updateNotification).toHaveBeenCalledTimes(1);
      expect(store.getState().updateNotification).toHaveBeenCalledWith(fakeNotificationUpdate);

      // Fast-forward until all timers have been executed
      vi.runAllTimers();

      expect(store.getState().removeNotification).toHaveBeenCalledTimes(1);
      expect(store.getState().removeNotification).toHaveBeenCalledWith({
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
      expect(store.getState().addNotification).toHaveBeenCalledTimes(1);
      expect(store.getState().addNotification).toHaveBeenCalledWith(customFakeNotificationInput);

      // Fast-forward until all timers have been executed
      vi.runAllTimers();

      expect(store.getState().removeNotification).not.toHaveBeenCalledWith(1);
    });
  });
});
