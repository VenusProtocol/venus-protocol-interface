/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import React from 'react';
import { cn } from 'utilities';

import { MarkdownViewer } from '../MarkdownViewer';

export interface MarkdownEditorProps {
  value: string;
  onChange: (text: string | undefined) => void;
  name: string;
  placeholder: string;
  hasError?: boolean;
  className?: string;
  label?: string;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement, Element>) => void;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  name,
  placeholder,
  // hasError,
  className,
  label,
  onBlur,
}) => (
  <div className={cn(className)}>
    {!!label && (
      <Typography variant="small1" component="label" htmlFor={name}>
        {label}
      </Typography>
    )}

    <div className="flex space-x-4">
      <textarea
        placeholder={placeholder}
        onChange={e => onChange(e.currentTarget.value)}
        onBlur={onBlur}
        className="flex-1 bg-background"
      />

      <MarkdownViewer className="flex-1" content={value} />
    </div>
  </div>
);
