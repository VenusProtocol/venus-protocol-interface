import Markdown from 'react-markdown';
import { cn } from 'utilities';

export interface MarkdownViewerProps {
  className?: string;
  content: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ className, content }) => (
  // TODO: add style and options
  <Markdown
    className={cn('flex-1', className)}
    allowedElements={['h1', 'h2', 'h3', 'h4', 'p', 'a', 'ul', 'li', 'strong', 'em']}
    skipHtml
  >
    {content}
  </Markdown>
);
