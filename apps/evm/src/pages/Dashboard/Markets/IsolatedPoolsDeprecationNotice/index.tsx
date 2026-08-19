import { chains } from '@venusprotocol/chains';

import { useGetChainIdsWithIsolatedPoolPosition } from 'clients/api';
import { NoticeWarning } from 'components';
import { VENUS_ISOLATED_E_MODE_GUIDE_URL } from 'constants/production';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';

export interface IsolatedPoolsDeprecationNoticeProps {
  className?: string;
}

export const IsolatedPoolsDeprecationNotice: React.FC<IsolatedPoolsDeprecationNoticeProps> = ({
  className,
}) => {
  const { Trans, language } = useTranslation();
  const { chainIds, isLoading } = useGetChainIdsWithIsolatedPoolPosition();

  if (isLoading || chainIds.length === 0) {
    return undefined;
  }

  const chainNames = new Intl.ListFormat(language.bcp47Tag, { type: 'conjunction' }).format(
    chainIds.map(chainId => chains[chainId].name),
  );

  return (
    <NoticeWarning
      className={className}
      description={
        <Trans
          i18nKey="account.isolatedPoolsDeprecationNotice.description"
          values={{ chainNames }}
          components={{
            LearnMore: <Link className="underline" href={VENUS_ISOLATED_E_MODE_GUIDE_URL} />,
          }}
        />
      }
    />
  );
};
