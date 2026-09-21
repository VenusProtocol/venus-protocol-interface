import { cn } from '@venusprotocol/ui';

export interface ImgGroupItem {
  src: string;
  alt: string;
}

export interface ImgGroupProps {
  imgs: ImgGroupItem[];
  removeDuplicates?: boolean;
  className?: string;
  limit?: number;
}

export const ImgGroup: React.FC<ImgGroupProps> = ({
  className,
  imgs,
  removeDuplicates,
  limit = 0,
}) => {
  const sanitizedImgs = removeDuplicates
    ? imgs.filter((img, index) => imgs.findIndex(other => other.src === img.src) === index)
    : imgs;
  const filteredImgs = limit > 0 ? sanitizedImgs.slice(0, limit) : sanitizedImgs;

  return (
    <div className={cn('inline-flex items-center', className)}>
      {filteredImgs.map((img, index) => (
        <img
          alt={img.alt}
          className={cn('size-5', index > 0 && '-ml-1')}
          src={img.src}
          key={`img-group-item-${img.src}-${index}`}
        />
      ))}

      {limit > 0 && sanitizedImgs.length > limit && (
        <span className="text-b1r text-white ml-2">+{sanitizedImgs.length - limit}</span>
      )}
    </div>
  );
};
