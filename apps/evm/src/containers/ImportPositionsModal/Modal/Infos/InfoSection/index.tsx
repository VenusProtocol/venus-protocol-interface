import { Icon, type IconName } from 'components';

export interface InfoSectionProps {
  title: string;
  description: string;
  iconName: IconName;
  iconColorClass: string;
  iconContainerColorClass: string;
}

export const InfoSection: React.FC<InfoSectionProps> = ({
  title,
  description,
  iconColorClass,
  iconContainerColorClass,
  iconName,
}) => (
  <div className="flex gap-x-2">
    <div
      className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 ${iconContainerColorClass}`}
    >
      <Icon className={`w-4 h-4 ${iconColorClass}`} name={iconName} />
    </div>

    <div className="space-y-1 grow">
      <h3 className="font-bold">{title}</h3>

      <p className="text-grey text-sm">{description}</p>
    </div>
  </div>
);
