import { screen } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import { tradePositions } from '__mocks__/models/trade';
import { useGetProportionalCloseTolerancePercentage } from 'clients/api';
import { en } from 'libs/translations';
import { MINIMUM_LEVERAGE_FACTOR } from 'pages/Trade/constants';
import { renderComponent } from 'testUtils/render';
import type { TokenAction, TradePosition } from 'types';
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

const basePosition = tradePositions[0];
const mockUseGetProportionalCloseTolerancePercentage =
  useGetProportionalCloseTolerancePercentage as Mock;

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
  dsaAsset = {},
  longAsset = {},
  shortAsset = {},
}: {
  dsaAsset?: Partial<TradePosition['dsaAsset']>;
  longAsset?: Partial<TradePosition['longAsset']>;
  shortAsset?: Partial<TradePosition['shortAsset']>;
} = {}): TradePosition => ({
  ...basePosition,
  dsaAsset: {
    ...basePosition.dsaAsset,
    disabledTokenActions: [] as TokenAction[],
    isRestricted: false,
    ...dsaAsset,
  },
  longAsset: {
    ...basePosition.longAsset,
    disabledTokenActions: [] as TokenAction[],
    isRestricted: false,
    ...longAsset,
  },
  shortAsset: {
    ...basePosition.shortAsset,
    disabledTokenActions: [] as TokenAction[],
    isRestricted: false,
    isBorrowable: true,
    ...shortAsset,
  },
});

const renderPositionForm = ({
  action = baseProps.action,
  position = baseProps.position,
}: {
  action?: FormProps['action'];
  position?: TradePosition;
} = {}) => renderComponent(<PositionForm {...baseProps} action={action} position={position} />);

describe('PositionForm', () => {
  beforeEach(() => {
    mockUseGetProportionalCloseTolerancePercentage.mockImplementation(() => ({
      data: {
        proportionalCloseTolerancePercentage: 2,
      },
    }));
  });

  it('renders Form when no warning applies', () => {
    renderPositionForm({
      position: getPosition(),
    });

    expect(screen.getByTestId('position-form')).toBeInTheDocument();
    expect(screen.getByText(baseProps.action)).toBeInTheDocument();
    expect(screen.getByText(baseProps.submitButtonLabel)).toBeInTheDocument();
    expect(screen.queryByTestId('notice-warning')).not.toBeInTheDocument();
  });

  it.each([
    {
      action: 'supplyDsa' as const,
      position: getPosition({
        dsaAsset: {
          disabledTokenActions: ['supply'],
        },
      }),
      expectedWarning: en.trade.operationForm.warning.cannotSupplyDsa,
    },
    {
      action: 'withdrawDsa' as const,
      position: getPosition({
        dsaAsset: {
          disabledTokenActions: ['withdraw'],
        },
      }),
      expectedWarning: en.trade.operationForm.warning.cannotWithdrawDsa,
    },
    {
      action: 'open' as const,
      position: getPosition({
        longAsset: {
          disabledTokenActions: ['supply'],
        },
      }),
      expectedWarning: en.trade.operationForm.warning.cannotSupplyLong,
    },
    {
      action: 'close' as const,
      position: getPosition({
        longAsset: {
          disabledTokenActions: ['withdraw'],
        },
      }),
      expectedWarning: en.trade.operationForm.warning.cannotWithdrawLong,
    },
    {
      action: 'increase' as const,
      position: getPosition({
        shortAsset: {
          disabledTokenActions: ['borrow'],
        },
      }),
      expectedWarning: en.trade.operationForm.warning.cannotBorrowShort,
    },
    {
      action: 'reduce' as const,
      position: getPosition({
        shortAsset: {
          disabledTokenActions: ['repay'],
        },
      }),
      expectedWarning: en.trade.operationForm.warning.cannotRepayShort,
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
        dsaAsset: {
          disabledTokenActions: ['withdraw'],
        },
        longAsset: {
          disabledTokenActions: ['withdraw'],
        },
        shortAsset: {
          disabledTokenActions: ['repay'],
        },
      }),
    });

    expect(screen.getByTestId('notice-warning')).toHaveTextContent(
      en.trade.operationForm.warning.cannotRepayShort,
    );
    expect(screen.queryByTestId('position-form')).not.toBeInTheDocument();
  });

  it.each([
    {
      action: 'supplyDsa' as const,
      position: getPosition({
        dsaAsset: {
          isRestricted: true,
        },
      }),
      expectedWarning: en.trade.operationForm.warning.cannotSupplyDsa,
    },
    {
      action: 'withdrawDsa' as const,
      position: getPosition({
        dsaAsset: {
          isRestricted: true,
          userSupplyBalanceCents: new BigNumber(0),
        },
      }),
      expectedWarning: en.trade.operationForm.warning.cannotWithdrawDsa,
    },
    {
      action: 'open' as const,
      position: getPosition({
        longAsset: {
          isRestricted: true,
        },
      }),
      expectedWarning: en.trade.operationForm.warning.cannotSupplyLong,
    },
    {
      action: 'increase' as const,
      position: getPosition({
        shortAsset: {
          isRestricted: true,
        },
      }),
      expectedWarning: en.trade.operationForm.warning.cannotBorrowShort,
    },
    {
      action: 'reduce' as const,
      position: getPosition({
        shortAsset: {
          isRestricted: true,
          userBorrowBalanceCents: new BigNumber(0),
        },
      }),
      expectedWarning: en.trade.operationForm.warning.cannotRepayShort,
    },
  ])(
    'renders a warning for $action when the required token is restricted',
    ({ action, position, expectedWarning }) => {
      renderPositionForm({
        action,
        position,
      });

      expect(screen.getByTestId('notice-warning')).toHaveTextContent(expectedWarning);
      expect(screen.queryByTestId('position-form')).not.toBeInTheDocument();
    },
  );

  it('renders Form when closing a restricted position with existing balances', () => {
    renderPositionForm({
      action: 'close',
      position: getPosition({
        dsaAsset: {
          isRestricted: true,
          userSupplyBalanceCents: new BigNumber(1),
        },
        longAsset: {
          isRestricted: true,
          userSupplyBalanceCents: new BigNumber(1),
        },
        shortAsset: {
          isRestricted: true,
          userBorrowBalanceCents: new BigNumber(1),
        },
      }),
    });

    expect(screen.getByTestId('position-form')).toBeInTheDocument();
    expect(screen.queryByTestId('notice-warning')).not.toBeInTheDocument();
  });

  it('renders Form when reducing a restricted position with existing balances', () => {
    renderPositionForm({
      action: 'reduce',
      position: getPosition({
        dsaAsset: {
          isRestricted: true,
          userSupplyBalanceCents: new BigNumber(1),
        },
        longAsset: {
          isRestricted: true,
          userSupplyBalanceCents: new BigNumber(1),
        },
        shortAsset: {
          isRestricted: true,
          userBorrowBalanceCents: new BigNumber(1),
        },
      }),
    });

    expect(screen.getByTestId('position-form')).toBeInTheDocument();
    expect(screen.queryByTestId('notice-warning')).not.toBeInTheDocument();
  });

  it('renders a leverage warning for open when the pair cannot reach the minimum leverage factor', () => {
    renderPositionForm({
      action: 'open',
      position: getPosition({
        dsaAsset: {
          collateralFactor: 0.2,
        },
        longAsset: {
          collateralFactor: 0.2,
        },
      }),
    });

    expect(screen.getByTestId('notice-warning')).toHaveTextContent(
      `This token pair does not allow a leverage factor of at least ${MINIMUM_LEVERAGE_FACTOR}`,
    );
    expect(screen.queryByTestId('position-form')).not.toBeInTheDocument();
  });
});
