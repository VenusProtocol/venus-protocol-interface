import { renderComponent } from 'testUtils/render';

import { useStore } from 'libs/notifications/store';

import NotificationCenter from '..';
import { notifications as fakeNotifications } from '../../__mocks__/models/notifications';
import TEST_IDS from '../testIds';

describe('NotificationCenter', () => {
  it('renders without crashing', () => {
    renderComponent(<NotificationCenter />);
  });

  it('renders notifications correctly', () => {
    // Add fake notifications to the store
    useStore.setState({
      notifications: fakeNotifications,
    });

    const { getByTestId } = renderComponent(<NotificationCenter />);

    expect(getByTestId(TEST_IDS.container).textContent).toMatchSnapshot();
  });
});
