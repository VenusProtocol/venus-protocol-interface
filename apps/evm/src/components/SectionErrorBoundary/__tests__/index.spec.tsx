import { fireEvent } from '@testing-library/react';

import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';

import { SectionErrorBoundary } from '..';

const Boom = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Boom');
  }

  return <div>subtree content</div>;
};

describe('SectionErrorBoundary', () => {
  beforeEach(() => {
    // React logs caught render errors through console.error
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('renders its children when they do not throw', () => {
    const { queryByText } = renderComponent(
      <SectionErrorBoundary>
        <Boom shouldThrow={false} />
      </SectionErrorBoundary>,
    );

    expect(queryByText('subtree content')).toBeInTheDocument();
    expect(queryByText(en.errorState.defaultMessage)).not.toBeInTheDocument();
  });

  it('replaces only its own subtree when a child throws', () => {
    const { queryByText } = renderComponent(
      <div>
        <span>sibling content</span>

        <SectionErrorBoundary>
          <Boom shouldThrow />
        </SectionErrorBoundary>
      </div>,
    );

    // The rest of the tree keeps rendering
    expect(queryByText('sibling content')).toBeInTheDocument();
    // The failing section is replaced by the error state
    expect(queryByText(en.errorState.defaultMessage)).toBeInTheDocument();
    expect(queryByText('subtree content')).not.toBeInTheDocument();
  });

  it('renders a retry button that resets the boundary', () => {
    // Read through a mutable holder so the component picks up the new value when it re-renders
    const holder = { shouldThrow: true };
    const ConditionalBoom = () => <Boom shouldThrow={holder.shouldThrow} />;

    const { queryByText, getByText } = renderComponent(
      <SectionErrorBoundary>
        <ConditionalBoom />
      </SectionErrorBoundary>,
    );

    expect(queryByText(en.errorState.defaultMessage)).toBeInTheDocument();

    holder.shouldThrow = false;
    fireEvent.click(getByText(en.errorState.buttonLabel));

    expect(queryByText(en.errorState.defaultMessage)).not.toBeInTheDocument();
    expect(queryByText('subtree content')).toBeInTheDocument();
  });

  it('displays a custom message when one is provided', () => {
    const message = 'Custom section error';

    const { queryByText } = renderComponent(
      <SectionErrorBoundary message={message}>
        <Boom shouldThrow />
      </SectionErrorBoundary>,
    );

    expect(queryByText(message)).toBeInTheDocument();
    expect(queryByText(en.errorState.defaultMessage)).not.toBeInTheDocument();
  });
});
