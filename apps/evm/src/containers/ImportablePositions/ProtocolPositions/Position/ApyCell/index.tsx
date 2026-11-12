export interface ApyProps {
  label: string;
  children: React.ReactNode;
}

export const ApyCell: React.FC<ApyProps> = ({ label, children }) => (
  <div className="border border-muted rounded-xl py-2 px-4 space-y-1 flex-1">
    <p className="text-secondary text-xs">{label}</p>

    <div className="text-sm">{children}</div>
  </div>
);
