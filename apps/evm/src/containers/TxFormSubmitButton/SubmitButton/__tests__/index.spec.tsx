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

  it('ignores a repeated click on a button that does not submit a form', () => {
    const onClick = vi.fn();

    const { getByRole } = renderComponent(<PrimaryButton onClick={onClick}>Approve</PrimaryButton>);
    const button = getByRole('button', { name: 'Approve' });

    clickAt(button, 1000);
    clickAt(button, 1008);
    clickAt(button, 1600);

    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('does not limit clicks on different buttons', () => {
    const onMaxClick = vi.fn();
    const onHalfClick = vi.fn();

    const { getByRole } = renderComponent(
      <>
        <PrimaryButton onClick={onMaxClick}>MAX</PrimaryButton>
        <PrimaryButton onClick={onHalfClick}>50%</PrimaryButton>
      </>,
    );

    clickAt(getByRole('button', { name: 'MAX' }), 1000);
    clickAt(getByRole('button', { name: '50%' }), 1008);

    expect(onMaxClick).toHaveBeenCalledTimes(1);
    expect(onHalfClick).toHaveBeenCalledTimes(1);
  });
});
