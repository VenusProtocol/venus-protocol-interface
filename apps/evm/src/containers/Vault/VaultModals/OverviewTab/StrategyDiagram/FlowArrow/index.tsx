import { Icon } from 'components';

export const FlowArrow: React.FC<{
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
}> = ({ leftContent, rightContent }) => (
  <div className="flex justify-center items-center py-1 h-10 text-b1r">
    <div className="flex-1 px-3 text-end">{leftContent}</div>
    <Icon name="diagramArrowDown" className="h-full text-grey" />
    <div className="flex-1 px-3 text-start">{rightContent}</div>
  </div>
);
