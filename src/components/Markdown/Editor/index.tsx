/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import MdEditor, { commands } from '@uiw/react-md-editor';
import React from 'react';

import previewOptions from '../previewOptions';
import { useStyles } from './styles';
import './styles-overrides.scss';

export interface MarkdownEditorProps {
  value: string;
  onChange: (text: string | undefined) => void;
  name: string;
  placeholder: string;
  hasError?: boolean;
  className?: string;
  label?: string;
  onBlur: (e: React.FocusEvent<HTMLTextAreaElement, Element>) => void;
}
const allowedCommands = [
  commands.title1,
  commands.title2,
  commands.title3,
  commands.title4,
  commands.unorderedListCommand,
  commands.link,
  commands.bold,
  commands.italic,
];

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  name,
  placeholder,
  hasError,
  className,
  label,
  onBlur,
}) => {
  const styles = useStyles();
  return (
    <>
      {!!label && (
        <Typography
          variant="small1"
          component="label"
          css={styles.getLabel(hasError)}
          htmlFor={name}
        >
          {label}
        </Typography>
      )}
      <MdEditor
        className={className}
        value={value}
        onChange={onChange}
        commands={allowedCommands}
        previewOptions={previewOptions}
        textareaProps={{
          placeholder,
          name,
          id: name,
          onBlur,
        }}
        placeholder={placeholder}
        css={styles.hasError(hasError)}
      />
    </>
  );
};

export default MarkdownEditor;
