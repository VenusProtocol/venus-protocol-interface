// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent, getByTestId } from '@testing-library/react';
import { Token } from 'types';

import { getTokenListItemTestId, getTokenSelectButtonTestId } from '../testIdGetters';

export const selectToken = ({
  token,
  selectTokenTextFieldTestId,
  container,
}: {
  token: Token;
  selectTokenTextFieldTestId: string;
  container: HTMLElement;
}) => {
  // Open token list
  fireEvent.click(
    getByTestId(
      container,
      getTokenSelectButtonTestId({ parentTestId: selectTokenTextFieldTestId }),
    ),
  );

  // Select token
  fireEvent.click(
    getByTestId(
      container,
      getTokenListItemTestId({
        parentTestId: selectTokenTextFieldTestId,
        tokenAddress: token.address,
      }),
    ),
  );
};
