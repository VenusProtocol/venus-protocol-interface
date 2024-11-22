import { useFormatTo } from 'hooks/useFormatTo';
import { Navigate } from 'react-router';

export interface RedirectProps {
  to: string;
}

export const Redirect: React.FC<RedirectProps> = ({ to }) => {
  const { formatTo } = useFormatTo();
  const formattedTo = formatTo({ to });

  return <Navigate to={formattedTo} replace />;
};
