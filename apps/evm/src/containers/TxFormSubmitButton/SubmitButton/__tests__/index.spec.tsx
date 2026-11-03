import { fireEvent } from '@testing-library/react';

import { PrimaryButton } from 'components';
import { renderComponent } from 'testUtils/render';

const clickAt = (element: HTMLElement, nowMs: number) => {
  vi.spyOn(performance, 'now').mockReturnValue(nowMs);
  fireEvent.click(element);
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
  afterEach(() => {
    vi.restoreAllMocks();
  });

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

  it('keeps submitting when the clock goes backwards', () => {
    const { onSubmit, button } = renderSubmitButton();

    clickAt(button, 1000);
    clickAt(button, 900);

    expect(onSubmit).toHaveBeenCalledTimes(2);
  });

  it('keeps submitting when the clock cannot be read', () => {
    const { onSubmit, button } = renderSubmitButton();

    clickAt(button, Number.NaN);
    clickAt(button, Number.NaN);
    clickAt(button, Number.NaN);

    expect(onSubmit).toHaveBeenCalledTimes(3);
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
