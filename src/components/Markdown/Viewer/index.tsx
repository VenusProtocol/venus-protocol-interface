/** @jsxImportSource @emotion/react */
import React from 'react';
import ReactMarkdown from '@uiw/react-markdown-preview';
import previewOptions from '../previewOptions';
import { useStyles } from './styles';

export interface IMarkdownViewerProps {
  content: string;
}

const Markdown: React.FC<IMarkdownViewerProps> = ({ content }) => {
  const styles = useStyles();
  return <ReactMarkdown source={content} css={styles.preview} {...previewOptions} />;
};

export default Markdown;
