import { cn } from '@venusprotocol/ui';

interface CodeSnippetProps {
  children: React.ReactNode;
  className?: string;
}

export const CodeSnippet: React.FC<CodeSnippetProps> = ({ children, className }) => (
  <div
    className={cn(
      'my-5 overflow-x-auto whitespace-pre rounded-lg border border-blue bg-background-active p-5 text-[0.95rem] text-green font-mono',
      className,
    )}
  >
    {children}
  </div>
);
