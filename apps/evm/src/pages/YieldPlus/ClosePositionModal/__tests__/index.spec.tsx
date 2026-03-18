import { fireEvent, screen, waitFor } from '@testing-library/react';

import { yieldPlusPositions } from '__mocks__/models/yieldPlus';
import { renderComponent } from 'testUtils/render';
import type { Mock } from 'vitest';

import { ClosePositionModal } from '..';
import { useGetSelectedYieldPlusPosition } from '../../useGetSelectedYieldPlusPosition';
import { store } from '../store';

vi.mock('components', () => ({
  Icon: () => <span data-testid="close-icon" />,
}));

vi.mock('motion/react', () => ({
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
}));

vi.mock('../Form', () => ({
  Form: () => <div data-testid="close-position-form" />,
}));

vi.mock('../../useGetSelectedYieldPlusPosition', () => ({
  useGetSelectedYieldPlusPosition: vi.fn(),
}));

const selectedPosition = yieldPlusPositions[0];

describe('ClosePositionModal', () => {
  beforeEach(() => {
    store.setState({
      isModalShown: false,
    });

    (useGetSelectedYieldPlusPosition as Mock).mockReturnValue({
      data: {
        position: selectedPosition,
      },
    });
  });

  it('does not render when modal is hidden', () => {
    renderComponent(<ClosePositionModal />);

    expect(screen.queryByTestId('close-position-form')).not.toBeInTheDocument();
  });

  it('renders modal content when modal is shown', async () => {
    store.setState({
      isModalShown: true,
    });

    renderComponent(<ClosePositionModal />);

    await waitFor(() => expect(screen.getByTestId('close-position-form')).toBeInTheDocument());
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('hides modal when close button is clicked', async () => {
    store.setState({
      isModalShown: true,
    });

    renderComponent(<ClosePositionModal />);

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() =>
      expect(screen.queryByTestId('close-position-form')).not.toBeInTheDocument(),
    );
    expect(store.getState().isModalShown).toBe(false);
  });
});
