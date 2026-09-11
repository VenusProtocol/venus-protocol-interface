export interface DistributionProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  value?: string;
  logoSrc?: string;
  description?: string | React.ReactNode;
}

export const Distribution: React.FC<DistributionProps> = ({
  name,
  description,
  value,
  logoSrc,
  ...otherProps
}) => (
  <div {...otherProps}>
    <div className="flex justify-between items-center gap-x-5">
      <div className="flex items-center gap-1">
        {!!logoSrc && <img src={logoSrc} alt={name} className="w-4 h-4" />}

        <p>{name}</p>
      </div>

      {!!value && <p>{value}</p>}
    </div>

    {!!description && <div className="text-grey text-sm">{description}</div>}
  </div>
);
