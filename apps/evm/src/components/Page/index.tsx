import { Helmet } from 'react-helmet';

export interface PageProps {
  children: React.ReactNode;
  indexWithSearchEngines?: boolean;
}

export const Page: React.FC<PageProps> = ({ children, indexWithSearchEngines = true }) => (
  <>
    {!indexWithSearchEngines && (
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
    )}

    {children}
  </>
);
