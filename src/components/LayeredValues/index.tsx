export interface LayeredValuesProps {
  topValue: string | number;
  bottomValue: string | number;
  className?: string;
}

export const LayeredValues: React.FC<LayeredValuesProps> = ({
  topValue,
  bottomValue,
  className,
}) => (
  <div className={className}>
    <p className="text-sm">{topValue}</p>
    <p className="text-xs text-grey">{bottomValue}</p>
  </div>
);

export default LayeredValues;
