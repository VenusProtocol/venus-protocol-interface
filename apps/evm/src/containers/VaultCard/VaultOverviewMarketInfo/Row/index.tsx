import type { Address } from 'viem';

import { Delimiter, Icon, LabeledInlineContent, type LabeledInlineContentProps } from 'components';
import { CopyAddressButton } from 'containers/CopyAddressButton';
import { Link } from 'containers/Link';

export interface RowProps extends LabeledInlineContentProps {
  address?: Address;
  url?: string;
}

export const Row: React.FC<RowProps> = ({ address, url, children, ...otherProps }) => {
  return (
    <div className="space-y-3">
      <LabeledInlineContent {...otherProps}>
        <div className="flex items-center gap-2">
          <span>{children}</span>

          {!!url && (
            <Link href={url} target="_blank">
              <Icon
                name="link"
                className="text-light-grey hover:cursor-pointer hover:text-blue active:text-blue"
              />
            </Link>
          )}

          {!!address && <CopyAddressButton address={address} className="text-light-grey" />}
        </div>
      </LabeledInlineContent>

      <Delimiter />
    </div>
  );
};
