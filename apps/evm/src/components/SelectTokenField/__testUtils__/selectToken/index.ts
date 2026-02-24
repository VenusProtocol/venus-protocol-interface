import { fireEvent, getByTestId } from '@testing-library/react';

import { getTokenListItemTestId } from 'components/TokenListWrapper/testIdGetters';
import type { Token } from 'types';
import { getTokenSelectButtonTestId } from '../getTokenSelectButtonTestId';

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
