import Markdown from 'react-markdown';

import { cn } from 'utilities';

import { Link } from '../../containers/Link';

export interface MarkdownViewerProps {
  content: string;
  className?: string;
}

const TITLE_CLASSES = cn('mb-2 mt-4 font-semibold text-grey first:mt-0');

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ className, content }) => (
  <Markdown
    className={className}
    allowedElements={['h1', 'h2', 'h3', 'h4', 'p', 'a', 'ul', 'li', 'ol', 'strong', 'em']}
    skipHtml
    components={{
      h1: ({ children, ...otherProps }) => (
        <h1 {...otherProps} className={TITLE_CLASSES}>
          {children}
        </h1>
      ),
      h2: ({ children, ...otherProps }) => (
        <h2 {...otherProps} className={TITLE_CLASSES}>
          {children}
        </h2>
      ),
      h4: ({ children, ...otherProps }) => (
        <h4 {...otherProps} className={TITLE_CLASSES}>
          {children}
        </h4>
      ),
      p: ({ children, ...otherProps }) => (
        <p {...otherProps} className="mb-4">
          {children}
        </p>
      ),
      a: ({ children, ...otherProps }) => <Link {...otherProps}>{children}</Link>,
      ul: ({ children, ...otherProps }) => (
        <ul {...otherProps} className="mb-4 list-disc pl-6">
          {children}
        </ul>
      ),
      ol: ({ children, ...otherProps }) => (
        <ul {...otherProps} className="mb-4 list-decimal pl-6">
          {children}
        </ul>
      ),
    }}
  >
    {content}
  </Markdown>
);
