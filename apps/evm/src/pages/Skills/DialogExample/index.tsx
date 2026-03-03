import { CodeSnippet } from '../CodeSnippet';

interface DialogExampleProps {
  children: React.ReactNode;
}

export const DialogExample: React.FC<DialogExampleProps> = ({ children }) => (
  <CodeSnippet className="whitespace-normal">{children}</CodeSnippet>
);
