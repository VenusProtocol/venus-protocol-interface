import { cn } from '@venusprotocol/ui';
import { Card } from 'components';

import { Link } from 'containers/Link';
import type { VoteSupport } from 'types';

import { Chip } from '../../components/Chip';

interface ProposalCardProps {
  className?: string;
  linkTo: string;
  proposalNumber: number;
  title: string;
  userVoteStatus?: VoteSupport;
  headerRightItem?: React.ReactElement;
  headerLeftItem?: React.ReactElement;
  contentRightItem: React.ReactElement;
  footer?: React.ReactElement;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({
  className,
  linkTo,
  proposalNumber,
  title,
  headerRightItem,
  headerLeftItem,
  contentRightItem,
  footer,
  ...containerProps
}) => {
  return (
    <Card className={cn('px-0 py-0 sm:px-4', className)} asChild {...containerProps}>
      <Link className="hover:no-underline" to={linkTo}>
        <div className="flex flex-wrap">
          <div className="flex min-w-0 basis-full flex-col justify-between px-6 py-6 sm:basis-2/3 sm:pl-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Chip text={`#${proposalNumber}`} />
                {headerLeftItem}
              </div>

              {headerRightItem}
            </div>

            <h4 className="mt-5 mb-6 line-clamp-2 text-lg text-white">{title}</h4>

            {footer}
          </div>

          <div className="flex min-w-0 basis-full flex-row items-center justify-center border-lightGrey border-t p-6 sm:basis-1/3 sm:flex-col sm:border-l sm:border-t-0 sm:py-6 sm:pl-6 sm:pr-0">
            {contentRightItem}
          </div>
        </div>
      </Link>
    </Card>
  );
};
