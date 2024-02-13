import { waitFor } from '@testing-library/react';
import { en } from 'libs/translations';

import { renderComponent } from 'testUtils/render';

import Convert from '.';

describe('pages/ConvertVRT/Convert', () => {
  it('renders info that the conversion deadline has been reached', async () => {
    const { getByText } = renderComponent(<Convert />);
    const infoMessage = getByText(en.convertVrt.infoConversionCompleted);
    await waitFor(() => expect(infoMessage).toBeVisible());
  });
});
