/** @jsxImportSource @emotion/react */
import React, { ReactElement } from 'react';

import { QuinaryButton } from '../Button';
import { useStyles } from './styles';

export interface Tag {
  content: string | number | ReactElement;
  id: number | string;
}

export interface TagGroupProps {
  tags: Tag[];
  activeTagIndex: number;
  onTagClick: (newIndex: number) => void;
  className?: string;
}

export const TagGroup = ({ tags, activeTagIndex, onTagClick, className }: TagGroupProps) => {
  const styles = useStyles();

  return (
    <div css={styles.container} className={className}>
      {tags.map((tag, index) => (
        <QuinaryButton
          active={index === activeTagIndex}
          key={`tag-group-tag-${tag.id}`}
          onClick={() => onTagClick(index)}
          css={styles.tag}
        >
          {tag.content}
        </QuinaryButton>
      ))}
    </div>
  );
};
