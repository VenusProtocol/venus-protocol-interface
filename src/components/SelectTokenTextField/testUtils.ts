import { fireEvent, getByTestId } from '@testing-library/react';
import { Token } from 'types';

import TEST_ID_FRAGMENTS from './testIdFragments';

export const getTokenInput = ({
  selectTokenTextFieldTestId,
  container,
}: {
  selectTokenTextFieldTestId: string;
  container: HTMLElement;
}) => getByTestId(container, `${selectTokenTextFieldTestId}${TEST_ID_FRAGMENTS.tokenTextField}`);

export const getTokenSelectButton = ({
  selectTokenTextFieldTestId,
  container,
}: {
  selectTokenTextFieldTestId: string;
  container: HTMLElement;
}) => getByTestId(container, `${selectTokenTextFieldTestId}${TEST_ID_FRAGMENTS.tokenSelectButton}`);

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
  fireEvent.click(getTokenSelectButton({ container, selectTokenTextFieldTestId }));

  // Select token
  fireEvent.click(
    getByTestId(
      container,
      `${selectTokenTextFieldTestId}${TEST_ID_FRAGMENTS.tokenListItem}-${token.address}`,
    ),
  );
};
