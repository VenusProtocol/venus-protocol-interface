import { ButtonWrapper, LayeredValues, TokenIcon, TokenIconWithSymbol } from 'components';
import { Link } from 'containers/Link';
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
        <TokenIconWithSymbol token={token} displayChain />
      </div>

      <div className="hidden sm:flex sm:items-center">
        <LayeredValues
          topValue={readableUserBorrowBalanceTokens}
          bottomValue={readableUserBorrowBalanceDollars}
        />
      </div>

      <div className="flex items-center">
        <ButtonWrapper
          size="xs"
          className="ml-auto w-auto text-offWhite hover:no-underline"
          asChild
        >
          <Link to={to} target="_blank">
            {t('eModeGroupList.group.cannotEnable.modal.repayButtonLabel')}
          </Link>
        </ButtonWrapper>
      </div>
    </div>
  );
};
