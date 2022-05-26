/** @jsxImportSource @emotion/react */
import React, { ReactElement } from 'react';
import Typography from '@mui/material/Typography';
import { Button } from '../Button';
import { Icon, IIconProps } from '../Icon';
import { useStyles } from './styles';
import { usePagination } from './usePagination';

interface IPaginationButtonProps {
  className?: string;
  onClick: () => void;
  children: number | ReactElement;
}

const PaginationButton: React.FC<IPaginationButtonProps> = ({ className, onClick, children }) => {
  const classes = useStyles();
  return (
    <Button variant="text" css={[classes.button]} className={className} onClick={onClick}>
      {children}
    </Button>
  );
};

interface IPaginationProps {
  itemsCount: number;
  onChange: (newPageIndex: number) => void;
  initialPageNumber?: number;
  itemsPerPageCount?: number;
  className?: string;
}

export const Pagination = ({
  itemsCount,
  onChange,
  initialPageNumber,
  itemsPerPageCount,
  className,
}: IPaginationProps) => {
  const {
    pagesCount,
    activePageIndex,
    goToPageByIndex,
    itemsCountString,
    pagesArray,
    minPageIndexToShow,
    maxPageIndexToShow,
  } = usePagination({
    itemsCount,
    onChange,
    initialPageNumber,
    itemsPerPageCount,
  });

  const classes = useStyles();

  if (pagesCount <= 1) {
    return null;
  }

  const iconProps: IIconProps = { size: '25', name: 'arrowRight', color: 'inherit' };

  return (
    <div css={[classes.root, className]}>
      {itemsCountString && (
        <Typography css={classes.itemsCountString}>{itemsCountString}</Typography>
      )}

      {pagesArray.map((page, index) => {
        if (index === maxPageIndexToShow) {
          return (
            <PaginationButton key={page} onClick={() => goToPageByIndex(activePageIndex + 1)}>
              <Icon {...iconProps} />
            </PaginationButton>
          );
        }

        if (index === minPageIndexToShow) {
          return (
            <PaginationButton key={page} onClick={() => goToPageByIndex(activePageIndex - 1)}>
              <Icon css={classes.iconReverted} {...iconProps} />
            </PaginationButton>
          );
        }

        if (index < minPageIndexToShow || index > maxPageIndexToShow) {
          return null;
        }

        return (
          <PaginationButton
            key={page}
            onClick={() => goToPageByIndex(index)}
            css={classes.getButtonStyles({ isActive: index === activePageIndex })}
          >
            {page}
          </PaginationButton>
        );
      })}
    </div>
  );
};
