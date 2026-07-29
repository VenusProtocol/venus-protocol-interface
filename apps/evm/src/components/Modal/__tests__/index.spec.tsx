import { fireEvent, screen } from '@testing-library/react';

import { renderComponent } from 'testUtils/render';

import { Modal } from '..';
import { MODAL_BACKDROP_TEST_ID } from '../testIds';

describe('components/Modal', () => {
  it('renders a dialog with a backdrop and closes when the backdrop is clicked', () => {
    const handleCloseMock = vi.fn();

    renderComponent(
      <Modal isOpen handleClose={handleCloseMock} title="Modal title">
        <div>Modal content</div>
      </Modal>,
    );

    const backdrop = screen.getByTestId(MODAL_BACKDROP_TEST_ID);
    const dialog = screen.getByRole('dialog', { name: 'Modal title' });
    const modalContent = screen.getByText('Modal content');
    const closeButton = screen.getByRole('button', { name: 'Close' });

    expect(backdrop).toBeInstanceOf(HTMLDivElement);
    expect(dialog).toContainElement(modalContent);
    expect(modalContent).toBeInTheDocument();

    fireEvent.click(backdrop);
    fireEvent.click(closeButton);

    expect(handleCloseMock).toHaveBeenCalledTimes(2);
  });

  it('routes native cancel events through handleClose', () => {
    const handleCloseMock = vi.fn();

    renderComponent(
      <Modal isOpen handleClose={handleCloseMock} title="Modal title">
        <div>Modal content</div>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Modal title' });
    const cancelEvent = new Event('cancel', { cancelable: true });

    fireEvent(dialog, cancelEvent);

    expect(cancelEvent.defaultPrevented).toBe(true);
    expect(handleCloseMock).toHaveBeenCalledTimes(1);
  });

  it('unmounts children when closed', () => {
    const { rerender } = renderComponent(
      <Modal isOpen title="Modal title">
        <input aria-label="Delegate address" defaultValue="" />
      </Modal>,
    );

    fireEvent.change(screen.getByLabelText('Delegate address'), {
      target: { value: '0x123' },
    });

    expect(screen.getByLabelText('Delegate address')).toHaveValue('0x123');

    rerender(
      <Modal isOpen={false} title="Modal title">
        <input aria-label="Delegate address" defaultValue="" />
      </Modal>,
    );

    expect(screen.queryByLabelText('Delegate address')).not.toBeInTheDocument();

    rerender(
      <Modal isOpen title="Modal title">
        <input aria-label="Delegate address" defaultValue="" />
      </Modal>,
    );

    expect(screen.getByLabelText('Delegate address')).toHaveValue('');
  });
});
