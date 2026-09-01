import { cn } from '@venusprotocol/ui';

export interface ImgGroupProps {
  imgSrcs: string[];
  removeDuplicates?: boolean;
  className?: string;
  limit?: number;
}

export const ImgGroup: React.FC<ImgGroupProps> = ({
  className,
  imgSrcs,
  removeDuplicates,
  limit = 0,
}) => {
  const sanitizedImgSrcs = removeDuplicates ? [...new Set(imgSrcs)] : imgSrcs;
  const filteredImgSrcs = limit > 0 ? sanitizedImgSrcs.slice(0, limit) : sanitizedImgSrcs;

  return (
    <div className={cn('inline-flex items-center', className)}>
      {filteredImgSrcs.map((imgSrc, index) => (
        <img
          alt={imgSrc}
          className={cn('size-5', index > 0 && '-ml-1')}
          src={imgSrc}
          key={`img-group-item-${imgSrc}-${index}`}
        />
      ))}

      {limit > 0 && sanitizedImgSrcs.length > limit && (
        <span className="text-b1r text-white ml-2">+{sanitizedImgSrcs.length - limit}</span>
      )}
    </div>
  );
};
