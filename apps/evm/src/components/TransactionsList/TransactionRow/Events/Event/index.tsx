import { TokenIcon } from 'components/TokenIcon';
import type { Token } from 'types';

export interface EventProps {
  title: string | React.ReactNode;
  description: string;
  token?: Token;
}

export const Event: React.FC<EventProps> = ({ token, title, description }) => (
  <div className="flex w-full items-center gap-x-2">
    {token && <TokenIcon token={token} />}

    <div className="flex flex-col">
      <span className="text-sm">{title}</span>

      <span className="text-light-grey text-xs">{description}</span>
    </div>
  </div>
);
