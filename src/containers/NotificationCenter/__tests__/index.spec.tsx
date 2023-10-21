import { notificationStore } from 'stores/notifications';

import { notifications as fakeNotifications } from '__mocks__/models/notifications';
import renderComponent from 'testUtils/renderComponent';

import NotificationCenter from '..';
import TEST_IDS from '../testIds';

describe('NotificationCenter', () => {
  it('renders without crashing', () => {
    renderComponent(<NotificationCenter />);
  });

  it('renders notifications correctly', () => {
    // Add fake notifications to the store
    notificationStore.setState({
      notifications: fakeNotifications,
    });

    const { getByTestId } = renderComponent(<NotificationCenter />);

    expect(getByTestId(TEST_IDS.container).textContent).toMatchSnapshot();
  });
});
