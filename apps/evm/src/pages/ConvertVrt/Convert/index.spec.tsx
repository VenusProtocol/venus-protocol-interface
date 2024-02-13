import { waitFor } from '@testing-library/react';

import { renderComponent } from 'testUtils/render';

import { en } from 'libs/translations';

import Convert from '.';

describe('pages/ConvertVRT/Convert', () => {
  it('renders info that the conversion deadline has been reached', async () => {
    const { getByText } = renderComponent(<Convert />);
    const infoMessage = getByText(en.convertVrt.infoConversionCompleted);
    await waitFor(() => expect(infoMessage).toBeVisible());
  });
});
