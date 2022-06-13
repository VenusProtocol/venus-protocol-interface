/** @jsxImportSource @emotion/react */
import React from 'react';

import MdEditor, { commands } from '@uiw/react-md-editor';

export interface IMarkdownProps {
  value: string;
  onChange: (text: string | undefined) => void;
}
const allowedCommands = [
  commands.title,
  commands.bold,
  commands.italic,
  commands.unorderedListCommand,
  commands.orderedListCommand,
  commands.link,
];

const MarkdownEditor: React.FC<IMarkdownProps> = ({ value, onChange }) => (
  <MdEditor
    value={value}
    onChange={onChange}
    commands={allowedCommands}
    // allowedElements={['h1', 'h2', 'h3', 'h4', 'p', 'a', 'ul', 'li', 'strong', 'italic']}
  />
);

export default MarkdownEditor;
