/** @jsxImportSource @emotion/react */
import React from 'react';
import ReactMarkdown from '@uiw/react-markdown-preview';
import previewOptions from '../previewOptions';
import { useStyles } from './styles';

export interface IMarkdownViewerProps {
  content: string;
  className?: string;
}

const Markdown: React.FC<IMarkdownViewerProps> = ({ content, className }) => {
  const styles = useStyles();
  return (
    <ReactMarkdown
      className={className}
      source={content}
      css={styles.preview}
      {...previewOptions}
      linkTarget="_blank"
    />
  );
};

export default Markdown;
