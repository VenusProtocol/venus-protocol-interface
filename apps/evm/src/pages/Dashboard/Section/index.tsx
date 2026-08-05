export interface SectionProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ title, className, children }) => (
  <div className={className}>
    {!!title && <h2 className="mb-4 flex items-center text-xl">{title}</h2>}

    {children}
  </div>
);

export default Section;
