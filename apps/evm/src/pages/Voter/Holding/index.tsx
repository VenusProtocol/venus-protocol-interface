import { cn } from '@venusprotocol/ui';
import type BigNumber from 'bignumber.js';

import { Card, Delimiter, Icon } from 'components';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';

interface HoldingProps {
  className?: string;
  balanceMantissa: BigNumber | undefined;
  delegateCount: number | undefined;
  votesMantissa: BigNumber | undefined;
  delegating: boolean;
}

export const Holding: React.FC<HoldingProps> = ({
  className,
  balanceMantissa,
  delegateCount,
  votesMantissa,
  delegating,
}) => {
  const { t } = useTranslation();
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const readableVenusBalance = useConvertMantissaToReadableTokenString({
    value: balanceMantissa,
    token: xvs,
    addSymbol: false,
  });

  const readableVotes = useConvertMantissaToReadableTokenString({
    value: votesMantissa,
    token: xvs,
    addSymbol: false,
  });

  return (
    <Card className={cn('flex-col', className)}>
      <h2 className="mb-8 text-p2s">{t('voterDetail.holding')}</h2>

      <p className="text-b1r text-grey">{t('voterDetail.venusBalance')}</p>

      <p className="mt-1 text-p2s">{readableVenusBalance}</p>

      <Delimiter className="my-6" />

      <p className="text-b1r text-grey">{t('voterDetail.votes')}</p>

      <div className="flex flex-row items-center justify-between">
        <p className="mt-1 text-p2s">{readableVotes}</p>

        <div className="inline-flex flex-row items-center">
          <Icon name="person" />

          <p className="mt-1 ml-1 text-p2s text-grey">
            {delegateCount?.toString() || PLACEHOLDER_KEY}
          </p>
        </div>
      </div>

      <Delimiter className="my-6" />

      <p className="text-b1r text-grey">{t('voterDetail.delegatingTo')}</p>

      <p className="mt-1 text-p2s">
        {delegating ? t('voterDetail.delegated') : t('voterDetail.undelegated')}
      </p>
    </Card>
  );
};

export default Holding;
