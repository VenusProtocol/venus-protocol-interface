import type { ReactElement } from 'react';

import { Button, type ButtonVariant, cn } from '@venusprotocol/ui';

export interface Tag {
  content: string | number | ReactElement;
  id: number | string;
  className?: string;
}

export interface TagGroupProps {
  tags: Tag[];
  activeTagIndex: number;
  onTagClick: (newIndex: number) => void;
  className?: string;
  btnVariant?: ButtonVariant;
}

export const TagGroup = ({
  tags,
  activeTagIndex,
  onTagClick,
  className,
  btnVariant = 'quaternary',
}: TagGroupProps) => (
  <div
    className={cn(
      'scrollbar-hidden flex items-center overflow-y-auto md:overflow-y-visible md:flex-wrap gap-2',
      className,
    )}
  >
    {tags.map((tag, index) => (
      <Button
        variant={btnVariant}
        active={index === activeTagIndex}
        key={`tag-group-tag-${tag.id}`}
        onClick={() => onTagClick(index)}
        className={cn('whitespace-nowrap px-5 py-2', tag.className)}
      >
        {tag.content}
      </Button>
    ))}
  </div>
);
