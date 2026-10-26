import { screen } from '@testing-library/react';

import { spokePools } from '__mocks__/models/spokePools';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';

import { LoanInfo } from '..';

const asset = spokePools[0].assets.find(({ isBorrowable }) => isBorrowable)!;

const getBorrowerCountRow = () => {
  let element: HTMLElement | null = screen.getByText(en.spokeMarket.loanInfo.borrowerCount);

  while (element && element.textContent === en.spokeMarket.loanInfo.borrowerCount) {
    element = element.parentElement;
  }

  return element as HTMLElement;
};

describe('LoanInfo', () => {
  it('shows the borrower count served by the API', () => {
    renderComponent(
      <LoanInfo asset={{ ...asset, borrowerCount: 3, isParticipantCountUnavailable: false }} />,
    );

    expect(getBorrowerCountRow()).toHaveTextContent('3');
  });

  it('shows a placeholder while the API does not serve the borrower count', () => {
    renderComponent(
      <LoanInfo asset={{ ...asset, borrowerCount: 0, isParticipantCountUnavailable: true }} />,
    );

    expect(getBorrowerCountRow()).toHaveTextContent(PLACEHOLDER_KEY);
  });
});
