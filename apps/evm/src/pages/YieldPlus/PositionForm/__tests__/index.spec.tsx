import { screen } from '@testing-library/react';

import { yieldPlusPositions } from '__mocks__/models/yieldPlus';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { TokenAction, YieldPlusPosition } from 'types';
import { type FormProps, PositionForm } from '..';

vi.mock('components', () => ({
  NoticeWarning: ({ description }: { description: string }) => (
    <div data-testid="notice-warning">{description}</div>
  ),
}));

vi.mock('../Form', () => ({
  Form: ({ action, submitButtonLabel }: Pick<FormProps, 'action' | 'submitButtonLabel'>) => (
    <div data-testid="position-form">
      <span>{action}</span>
      <span>{submitButtonLabel}</span>
    </div>
  ),
}));

const basePosition = yieldPlusPositions[0];

const baseProps: FormProps = {
  action: 'open',
  position: basePosition,
  formValues: {
    leverageFactor: 2,
    dsaToken: basePosition.dsaAsset.vToken.underlyingToken,
    dsaAmountTokens: '',
    shortAmountTokens: '',
    longAmountTokens: '',
    acknowledgeRisk: false,
    acknowledgeHighPriceImpact: false,
  },
  setFormValues: vi.fn(),
  balanceMutations: [],
  submitButtonLabel: 'Submit',
  onSubmit: vi.fn(async () => undefined),
  isSubmitting: false,
};

const getPosition = ({
  dsaDisabledTokenActions = basePosition.dsaAsset.disabledTokenActions,
  longDisabledTokenActions = basePosition.longAsset.disabledTokenActions,
  shortDisabledTokenActions = basePosition.shortAsset.disabledTokenActions,
}: {
  dsaDisabledTokenActions?: TokenAction[];
  longDisabledTokenActions?: TokenAction[];
  shortDisabledTokenActions?: TokenAction[];
} = {}): YieldPlusPosition => ({
  ...basePosition,
  dsaAsset: {
    ...basePosition.dsaAsset,
    disabledTokenActions: dsaDisabledTokenActions,
  },
  longAsset: {
    ...basePosition.longAsset,
    disabledTokenActions: longDisabledTokenActions,
  },
  shortAsset: {
    ...basePosition.shortAsset,
    disabledTokenActions: shortDisabledTokenActions,
  },
});

const renderPositionForm = ({
  action = baseProps.action,
  position = baseProps.position,
}: {
  action?: FormProps['action'];
  position?: YieldPlusPosition;
} = {}) => renderComponent(<PositionForm {...baseProps} action={action} position={position} />);

describe('PositionForm', () => {
  it('renders Form when no warning applies', () => {
    renderPositionForm();

    expect(screen.getByTestId('position-form')).toBeInTheDocument();
    expect(screen.getByText(baseProps.action)).toBeInTheDocument();
    expect(screen.getByText(baseProps.submitButtonLabel)).toBeInTheDocument();
    expect(screen.queryByTestId('notice-warning')).not.toBeInTheDocument();
  });

  it.each([
    {
      action: 'supplyDsa' as const,
      position: getPosition({
        dsaDisabledTokenActions: ['supply'],
      }),
      expectedWarning: en.yieldPlus.operationForm.warning.cannotSupplyDsa,
    },
    {
      action: 'withdrawDsa' as const,
      position: getPosition({
        dsaDisabledTokenActions: ['withdraw'],
      }),
      expectedWarning: en.yieldPlus.operationForm.warning.cannotWithdrawDsa,
    },
    {
      action: 'open' as const,
      position: getPosition({
        longDisabledTokenActions: ['supply'],
      }),
      expectedWarning: en.yieldPlus.operationForm.warning.cannotSupplyLong,
    },
    {
      action: 'close' as const,
      position: getPosition({
        longDisabledTokenActions: ['withdraw'],
      }),
      expectedWarning: en.yieldPlus.operationForm.warning.cannotWithdrawLong,
    },
    {
      action: 'increase' as const,
      position: getPosition({
        shortDisabledTokenActions: ['borrow'],
      }),
      expectedWarning: en.yieldPlus.operationForm.warning.cannotBorrowShort,
    },
    {
      action: 'reduce' as const,
      position: getPosition({
        shortDisabledTokenActions: ['repay'],
      }),
      expectedWarning: en.yieldPlus.operationForm.warning.cannotRepayShort,
    },
  ])(
    'renders a warning for $action when the action is disabled',
    ({ action, position, expectedWarning }) => {
      renderPositionForm({
        action,
        position,
      });

      expect(screen.getByTestId('notice-warning')).toHaveTextContent(expectedWarning);
      expect(screen.queryByTestId('position-form')).not.toBeInTheDocument();
    },
  );

  it('prioritizes the last matching warning when multiple disabled actions apply', () => {
    renderPositionForm({
      action: 'close',
      position: getPosition({
        dsaDisabledTokenActions: ['withdraw'],
        longDisabledTokenActions: ['withdraw'],
        shortDisabledTokenActions: ['repay'],
      }),
    });

    expect(screen.getByTestId('notice-warning')).toHaveTextContent(
      en.yieldPlus.operationForm.warning.cannotRepayShort,
    );
    expect(screen.queryByTestId('position-form')).not.toBeInTheDocument();
  });
});
