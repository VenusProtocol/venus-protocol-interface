/** @jsxImportSource @emotion/react */
import React from 'react';
import ReactMarkdown from '@uiw/react-markdown-preview';

export interface IMarkdownProps {
  content: string;
}

const Markdown: React.FC<IMarkdownProps> = ({ content }) => (
  <ReactMarkdown
    skipHtml
    source={content}
    allowedElements={['h1', 'h2', 'h3', 'h4', 'p', 'a', 'ul', 'li', 'strong', 'italic']}
  />
);

export default Markdown;
