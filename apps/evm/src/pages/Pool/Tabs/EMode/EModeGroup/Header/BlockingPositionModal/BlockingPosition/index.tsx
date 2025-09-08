import { ButtonWrapper, LayeredValues, TokenIcon, TokenIconWithSymbol } from 'components';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useFormatTo } from 'hooks/useFormatTo';
import { TAB_PARAM_KEY } from 'hooks/useTabs';
import { useTranslation } from 'libs/translations';
import type { Asset } from 'types';
import { formatCentsToReadableValue, formatTokensToReadableValue } from 'utilities';
import type { Address } from 'viem';

export interface BlockingPositionProps {
  asset: Asset;
  poolComptrollerAddress: Address;
}

export const BlockingPosition: React.FC<BlockingPositionProps> = ({
  poolComptrollerAddress,
  asset,
}) => {
  const { t } = useTranslation();

  const { formatTo } = useFormatTo();
  const marketTo = formatTo({
    to: {
      pathname: routes.market.path
        .replace(':poolComptrollerAddress', poolComptrollerAddress)
        .replace(':vTokenAddress', asset.vToken.address),
      search: `${TAB_PARAM_KEY}=repay`,
    },
  });

  const readableBorrowBalanceTokens = formatTokensToReadableValue({
    value: asset.borrowBalanceTokens,
    token: asset.vToken.underlyingToken,
  });

  const readableBorrowBalanceDollars = formatCentsToReadableValue({
    value: asset.borrowBalanceCents,
  });

  return (
    <div className="grid grid-cols-2 h-14 text-sm sm:grid-cols-3">
      <div className="flex items-center gap-x-2 sm:hidden">
        <TokenIcon token={asset.vToken.underlyingToken} />

        <LayeredValues
          topValue={readableBorrowBalanceTokens}
          bottomValue={readableBorrowBalanceDollars}
        />
      </div>

      <div className="hidden sm:flex sm:items-center">
        <TokenIconWithSymbol token={asset.vToken.underlyingToken} />
      </div>

      <div className="hidden sm:flex sm:items-center">
        <LayeredValues
          topValue={readableBorrowBalanceTokens}
          bottomValue={readableBorrowBalanceDollars}
        />
      </div>

      <div className="flex items-center">
        <ButtonWrapper small className="ml-auto w-auto text-offWhite hover:no-underline" asChild>
          <Link to={marketTo} target="_blank">
            {t('pool.eMode.group.cannotEnable.modal.repayButtonLabel')}
          </Link>
        </ButtonWrapper>
      </div>
    </div>
  );
};
