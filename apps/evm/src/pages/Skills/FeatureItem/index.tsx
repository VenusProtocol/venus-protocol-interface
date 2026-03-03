interface FeatureItemProps {
  title: string;
  description: string;
}

export const FeatureItem: React.FC<FeatureItemProps> = ({ title, description }) => (
  <li className="relative my-3 pl-7 text-white">
    <span className="absolute left-0 font-bold text-green">→</span>
    <strong>{title}</strong> — {description}
  </li>
);
