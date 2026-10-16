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

    expect(queryByText('sibling content')).toBeInTheDocument();
    expect(queryByText(en.errorState.defaultMessage)).toBeInTheDocument();
    expect(queryByText('subtree content')).not.toBeInTheDocument();
  });

  it('renders a retry button that resets the boundary', () => {
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

  it('recovers when it is re-keyed, which is how the layout clears a crash on route change', () => {
    const { queryByText, rerender } = renderComponent(
      <SectionErrorBoundary key="/markets">
        <Boom shouldThrow />
      </SectionErrorBoundary>,
    );

    expect(queryByText(en.errorState.defaultMessage)).toBeInTheDocument();

    rerender(
      <SectionErrorBoundary key="/dashboard">
        <Boom shouldThrow={false} />
      </SectionErrorBoundary>,
    );

    expect(queryByText('subtree content')).toBeInTheDocument();
    expect(queryByText(en.errorState.defaultMessage)).not.toBeInTheDocument();
  });

  it('does not carry its error into a sibling that takes its place, when each is keyed', () => {
    const renderTab = (tabId: string) =>
      tabId === 'broken' ? (
        <SectionErrorBoundary key="broken">
          <Boom shouldThrow />
        </SectionErrorBoundary>
      ) : (
        <SectionErrorBoundary key="healthy">
          <Boom shouldThrow={false} />
        </SectionErrorBoundary>
      );

    const { queryByText, rerender } = renderComponent(<div>{renderTab('broken')}</div>);

    expect(queryByText(en.errorState.defaultMessage)).toBeInTheDocument();

    rerender(<div>{renderTab('healthy')}</div>);

    expect(queryByText('subtree content')).toBeInTheDocument();
    expect(queryByText(en.errorState.defaultMessage)).not.toBeInTheDocument();
  });
});
