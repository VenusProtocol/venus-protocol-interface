import { fireEvent } from '@testing-library/react';

import { renderComponent } from 'testUtils/render';

import { en } from 'libs/translations';

import { Modal } from '..';

describe('Modal', () => {
  it('renders without crashing', () => {
    renderComponent(<Modal isOpen onClose={vi.fn()} />);
  });

  it('renders nothing if passed isOpen prop is false', () => {
    const { baseElement } = renderComponent(<Modal isOpen={false} onClose={vi.fn()} />);

    expect(baseElement.textContent).toEqual('');
  });

  it('calls onClose callback when clicking on close button', () => {
    const onCloseMock = vi.fn();
    const { getByText } = renderComponent(<Modal isOpen onClose={onCloseMock} />);

    // Click on close button
    fireEvent.click(getByText(en.lunaUstWarningModal.closeButtonLabel));

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
