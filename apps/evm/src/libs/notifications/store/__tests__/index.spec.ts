import { store } from '..';
import { notifications as fakeNotifications } from '../../__mocks__/models/notifications';
import type { AddNotificationInput } from '../types';

describe('store', () => {
  beforeEach(() => {
    // Add fake notifications to the store
    store.setState({
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
      const newNotificationId = store.getState().addNotification(fakeNotificationInput);

      expect(newNotificationId).toBe(fakeNotificationInput.id);
      expect(store.getState().notifications).toMatchInlineSnapshot(`
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
      store.getState().notifications[0].onClose!();

      expect(store.getState().notifications).toMatchInlineSnapshot(`
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
      const newNotificationId = store
        .getState()
        .addNotification({ description: 'Fake description' });

      expect(typeof newNotificationId).toBe('number');
    });
  });

  describe('updateNotification', () => {
    it('updates the right notification with the right arguments', () => {
      // Update notification
      store.getState().updateNotification({
        id: fakeNotifications[1].id,
        title: 'New fake title',
        description: 'New fake description',
        variant: 'error',
      });

      expect(store.getState().notifications).toMatchInlineSnapshot(`
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
      store.getState().removeNotification({
        id: fakeNotifications[1].id,
      });

      expect(store.getState().notifications).toMatchInlineSnapshot(`
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
