/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { ChainId } from 'types';
import { UrlType, cn, generateBscScanUrl } from 'utilities';

import { Breakpoint, EllipseAddress } from '../EllipseAddress';
import { Icon } from '../Icon';
import { Link } from '../Link';

export interface BscLinkProps {
  hash: string;
  chainId: ChainId;
  ellipseBreakpoint?: Breakpoint;
  urlType?: UrlType;
  className?: string;
  text?: string;
}

export const BscLink: React.FC<BscLinkProps> = ({
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
        href={chainId && generateBscScanUrl({ hash, urlType, chainId })}
        className="flex items-center"
      >
        {content}

        <Icon name="open" className="ml-2 text-inherit" />
      </Link>
    </div>
  );
};
