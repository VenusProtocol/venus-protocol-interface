/** @jsxImportSource @emotion/react */
import React from 'react';

import MdEditor, { commands } from '@uiw/react-md-editor';
import previewOptions from '../previewOptions';
import './styles.scss';

export interface IMarkdownProps {
  value: string;
  onChange: (text: string | undefined) => void;
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

const MarkdownEditor: React.FC<IMarkdownProps> = ({
  value,
  onChange,
  name,
  placeholder,
  hasError,
  className,
}) => {
  const styles = useStyles();

  return (
    <MdEditor
      className={className}
      value={value}
      onChange={onChange}
      commands={allowedCommands}
      previewOptions={previewOptions}
      textareaProps={{
        placeholder,
        name,
      }}
      placeholder={placeholder}
      css={styles.hasError(hasError)}
    />
  );
};

export default MarkdownEditor;
