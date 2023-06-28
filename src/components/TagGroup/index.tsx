/** @jsxImportSource @emotion/react */
import React, { ReactElement } from 'react';

import { QuinaryButton } from '../Button';
import { useStyles } from './styles';

export type TagContent = string | number | ReactElement;

export interface TagGroupProps {
  tagsContent: TagContent[];
  activeTagIndex: number;
  onTagClick: (newIndex: number) => void;
  className?: string;
}

export const TagGroup = ({ tagsContent, activeTagIndex, onTagClick, className }: TagGroupProps) => {
  const styles = useStyles();

  return (
    <div css={styles.container} className={className}>
      {tagsContent.map((tagContent, index) => (
        <QuinaryButton
          active={index === activeTagIndex}
          key={`tag-group-tag-${tagContent.toString()}`}
          onClick={() => onTagClick(index)}
          css={styles.tag}
        >
          {tagContent}
        </QuinaryButton>
      ))}
    </div>
  );
};
