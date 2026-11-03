import { fireEvent } from '@testing-library/react';

import { PrimaryButton } from 'components';
import { renderComponent } from 'testUtils/render';

const clickAt = (element: HTMLElement, timeStamp: number) => {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'timeStamp', { value: timeStamp });
  fireEvent(element, event);
};

const renderSubmitButton = () => {
  const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());

  const { getByRole } = renderComponent(
    <form onSubmit={onSubmit}>
      <PrimaryButton type="submit">Supply</PrimaryButton>
    </form>,
  );

  return { onSubmit, button: getByRole('button', { name: 'Supply' }) };
};

describe('submit button', () => {
  it('submits the form on a single click', () => {
    const { onSubmit, button } = renderSubmitButton();

    clickAt(button, 1000);

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('ignores a second click that lands within a double-click', () => {
    const { onSubmit, button } = renderSubmitButton();

    clickAt(button, 1000);
    clickAt(button, 1008);
    clickAt(button, 1400);

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('submits again once the double-click window has passed', () => {
    const { onSubmit, button } = renderSubmitButton();

    clickAt(button, 1000);
    clickAt(button, 1600);

    expect(onSubmit).toHaveBeenCalledTimes(2);
  });

  it('does not limit clicks on buttons that do not submit a form', () => {
    const onClick = vi.fn();

    const { getByRole } = renderComponent(<PrimaryButton onClick={onClick}>MAX</PrimaryButton>);
    const button = getByRole('button', { name: 'MAX' });

    clickAt(button, 1000);
    clickAt(button, 1008);
    clickAt(button, 1016);

    expect(onClick).toHaveBeenCalledTimes(3);
  });
});
