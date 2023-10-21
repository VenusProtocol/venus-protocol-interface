import { notifications as fakeNotifications } from '__mocks__/models/notifications';

import { notificationStore } from '..';
import { AddNotificationInput } from '../types';

describe('notifications', () => {
  beforeEach(() => {
    // Add fake notifications to the store
    notificationStore.setState({
      notifications: fakeNotifications,
    });
  });

  describe('addNotification', () => {
    it('adds a notification with the right arguments', () => {
      const fakeNotificationInput: AddNotificationInput = {
        id: 'fake-id',
        description: 'Fake description',
      };

      // Add notification
      const newNotificationId = notificationStore.getState().addNotification(fakeNotificationInput);

      expect(newNotificationId).toBe(fakeNotificationInput.id);
      expect(notificationStore.getState().notifications).toMatchInlineSnapshot(`
        [
          {
            "description": "Fake description",
            "id": "fake-id",
            "onClose": [Function],
          },
          {
            "description": "Fake description 0",
            "id": 0,
            "variant": "success",
          },
          {
            "description": "Fake description 1",
            "id": 1,
            "title": "Fake title 1",
          },
        ]
      `);

      // Test onClose function of newly added notification
      notificationStore.getState().notifications[0].onClose!();

      expect(notificationStore.getState().notifications).toMatchInlineSnapshot(`
        [
          {
            "description": "Fake description 0",
            "id": 0,
            "variant": "success",
          },
          {
            "description": "Fake description 1",
            "id": 1,
            "title": "Fake title 1",
          },
        ]
      `);
    });

    it('automatically assigns an ID if none was passed', () => {
      // Add notification
      const newNotificationId = notificationStore
        .getState()
        .addNotification({ description: 'Fake description' });

      expect(newNotificationId).toBeTypeOf('number');
    });
  });

  describe('updateNotification', () => {
    it('updates the right notification with the right arguments', () => {
      // Update notification
      notificationStore.getState().updateNotification({
        id: fakeNotifications[1].id,
        title: 'New fake title',
        description: 'New fake description',
        variant: 'error',
      });

      expect(notificationStore.getState().notifications).toMatchInlineSnapshot(`
        [
          {
            "description": "Fake description 0",
            "id": 0,
            "variant": "success",
          },
          {
            "description": "New fake description",
            "id": 1,
            "title": "New fake title",
            "variant": "error",
          },
        ]
      `);
    });
  });

  describe('removeNotification', () => {
    it('removes the right notification', () => {
      // Remove notification
      notificationStore.getState().removeNotification({
        id: fakeNotifications[1].id,
      });

      expect(notificationStore.getState().notifications).toMatchInlineSnapshot(`
        [
          {
            "description": "Fake description 0",
            "id": 0,
            "variant": "success",
          },
        ]
      `);
    });
  });
});
