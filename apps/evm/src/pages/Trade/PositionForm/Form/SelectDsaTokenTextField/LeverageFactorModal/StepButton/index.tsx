export interface StepButtonProps extends React.HTMLAttributes<HTMLButtonElement> {}

export const StepButton: React.FC<StepButtonProps> = props => (
  <button type="button" className="p-3 cursor-pointer" {...props} />
);
