import type { ReactElement } from 'react';

import { cn } from 'utilities';

import { QuinaryButton } from '../Button';

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

export const TagGroup = ({ tags, activeTagIndex, onTagClick, className }: TagGroupProps) => (
  <div
    className={cn(
      'scrollbar-hidden flex items-center overflow-y-auto md:overflow-y-visible md:flex-wrap gap-2',
      className,
    )}
  >
    {tags.map((tag, index) => (
      <QuinaryButton
        active={index === activeTagIndex}
        key={`tag-group-tag-${tag.id}`}
        onClick={() => onTagClick(index)}
        className="whitespace-nowrap px-5 py-2"
      >
        {tag.content}
      </QuinaryButton>
    ))}
  </div>
);
