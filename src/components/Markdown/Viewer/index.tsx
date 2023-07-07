/** @jsxImportSource @emotion/react */
import ReactMarkdown from '@uiw/react-markdown-preview';
import React from 'react';

import previewOptions from '../previewOptions';
import { useStyles } from './styles';

export interface MarkdownViewerProps {
  content: string;
  className?: string;
}

const Markdown: React.FC<MarkdownViewerProps> = ({ content, className }) => {
  const styles = useStyles();

  return (
    <ReactMarkdown
      className={className}
      source={content}
      css={styles.preview}
      {...previewOptions}
      linkTarget="_blank"
      wrapperElement={{
        'data-color-mode': 'dark',
      }}
    />
  );
};

export default Markdown;
