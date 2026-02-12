export interface CellProps {
  label: string;
  children: React.ReactNode;
}

export const Cell: React.FC<CellProps> = ({ children, label }) => (
  <div className="flex justify-between sm:justify-normal sm:flex-col sm:gap-y-2 sm:text-right">
    <p className="text-b1r text-light-grey">{label}</p>

    <div className="text-sm">{children}</div>
  </div>
);
