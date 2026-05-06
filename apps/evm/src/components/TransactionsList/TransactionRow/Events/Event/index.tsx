import { TokenIcon } from 'components/TokenIcon';
import type { Token } from 'types';

export interface EventProps {
  title: string | React.ReactNode;
  description: string;
  token?: Token;
}

export const Event: React.FC<EventProps> = ({ token, title, description }) => (
  <div className="flex w-full items-center gap-x-2">
    {token && <TokenIcon className="shrink-0" token={token} />}

    <div className="flex flex-col grow min-w-0">
      <span className="text-sm truncate">{title}</span>

      <span className="text-light-grey text-xs truncate">{description}</span>
    </div>
  </div>
);
