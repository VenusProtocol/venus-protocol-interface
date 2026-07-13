import { fireEvent, screen } from '@testing-library/react';

import { BODY_PORTAL_ID } from 'constants/layout';
import { renderComponent } from 'testUtils/render';

import { Modal } from '..';

describe('components/Modal', () => {
  beforeEach(() => {
    const backdropPortal = document.createElement('div');
    backdropPortal.id = BODY_PORTAL_ID;
    document.body.appendChild(backdropPortal);
  });

  afterEach(() => {
    document.getElementById(BODY_PORTAL_ID)?.remove();
  });

  it('renders the body backdrop into the shared portal and closes when the backdrop is clicked', () => {
    const handleCloseMock = vi.fn();

    renderComponent(
      <Modal isOpen handleClose={handleCloseMock} title="Modal title">
        <div>Modal content</div>
      </Modal>,
    );

    const backdropPortal = document.getElementById(BODY_PORTAL_ID);
    expect(backdropPortal).not.toBeNull();

    const backdrop = backdropPortal!.firstElementChild;
    const modalContent = screen.getByText('Modal content');
    const modalRoot = modalContent.closest('[role="presentation"]');
    const dialog = modalContent.parentElement;

    expect(backdrop).toBeInstanceOf(HTMLDivElement);
    expect(backdropPortal!.childElementCount).toBe(1);
    expect(backdropPortal).toContainElement(backdrop as HTMLDivElement);
    expect(modalContent).toBeInTheDocument();
    expect(modalRoot).toContainElement(dialog);
    expect(backdropPortal).not.toContainElement(modalContent);
    expect(dialog).toBeInstanceOf(HTMLDivElement);

    fireEvent.click(backdrop!);

    expect(handleCloseMock).toHaveBeenCalledTimes(1);
  });
});
