import { useMemo } from 'react';
import { useTranslation } from 'translation';
import { ChainId } from 'types';
import { UrlType, cn, generateChainExplorerUrl } from 'utilities';

import { Breakpoint, EllipseAddress } from '../EllipseAddress';
import { Icon } from '../Icon';
import { Link } from '../Link';

export interface ChainExplorerLinkProps {
  hash: string;
  chainId: ChainId;
  ellipseBreakpoint?: Breakpoint;
  urlType?: UrlType;
  className?: string;
  text?: string;
}

export const ChainExplorerLink: React.FC<ChainExplorerLinkProps> = ({
  hash,
  chainId,
  className,
  urlType,
  text,
  ellipseBreakpoint,
}) => {
  const { t } = useTranslation();

  const content = useMemo(() => {
    if (!text) {
      return t('bscLink.content');
    }

    if (text && ellipseBreakpoint) {
      return <EllipseAddress ellipseBreakpoint={ellipseBreakpoint} address={text} />;
    }

    return text;
  }, [text, ellipseBreakpoint]);

  return (
    <div className={cn('inline-block text-sm font-semibold text-blue', className)}>
      <Link
        href={generateChainExplorerUrl({ hash, urlType, chainId })}
        className="flex items-center"
      >
        {content}

        <Icon name="open" className="ml-2 text-inherit" />
      </Link>
    </div>
  );
};
