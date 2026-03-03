import { CodeSnippet } from '../CodeSnippet';
import { StepItem } from '../StepItem';

interface InstallationStepProps {
  code?: string;
  step: number;
  text: React.ReactNode;
}

export const InstallationStep: React.FC<InstallationStepProps> = ({ code, step, text }) => (
  <StepItem step={step}>
    {text}
    {code ? <CodeSnippet>{code}</CodeSnippet> : null}
  </StepItem>
);
