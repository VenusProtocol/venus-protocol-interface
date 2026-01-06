import { ButtonWrapper, LayeredValues, TokenIcon, TokenIconWithSymbol } from 'components';
import { Link } from 'containers/Link';
import { useAnalytics } from 'libs/analytics';
import { useTranslation } from 'libs/translations';
import { formatCentsToReadableValue, formatTokensToReadableValue } from 'utilities';
import type { BlockingBorrowPosition } from '../../../../types';

export type BlockingPositionProps = BlockingBorrowPosition;

export const BlockingPosition: React.FC<BlockingPositionProps> = ({
  token,
  userBorrowBalanceCents,
  userBorrowBalanceTokens,
  to,
}) => {
  const { t } = useTranslation();
  const { captureAnalyticEvent } = useAnalytics();

  const handleRepayClick = () =>
    captureAnalyticEvent('e_mode_click_repay_positions_modal', {
      tokenSymbol: token.symbol,
    });

  const readableUserBorrowBalanceTokens = formatTokensToReadableValue({
    value: userBorrowBalanceTokens,
    token,
  });

  const readableUserBorrowBalanceDollars = formatCentsToReadableValue({
    value: userBorrowBalanceCents,
  });

  return (
    <div className="grid grid-cols-2 h-14 text-sm sm:grid-cols-3">
      <div className="flex items-center gap-x-2 sm:hidden">
        <TokenIcon token={token} />

        <LayeredValues
          topValue={readableUserBorrowBalanceTokens}
          bottomValue={readableUserBorrowBalanceDollars}
        />
      </div>

      <div className="hidden sm:flex sm:items-center">
        <TokenIconWithSymbol token={token} />
      </div>

      <div className="hidden sm:flex sm:items-center">
        <LayeredValues
          topValue={readableUserBorrowBalanceTokens}
          bottomValue={readableUserBorrowBalanceDollars}
        />
      </div>

      <div className="flex items-center">
        <ButtonWrapper small className="ml-auto w-auto text-white hover:no-underline" asChild>
          <Link to={to} onClick={handleRepayClick} target="_blank">
            {t('markets.eMode.group.cannotEnable.modal.repayButtonLabel')}
          </Link>
        </ButtonWrapper>
      </div>
    </div>
  );
};
