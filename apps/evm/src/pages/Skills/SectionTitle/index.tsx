interface SectionTitleProps {
  icon: string;
  title: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ icon, title }) => (
  <h2 className="mb-5 flex items-center gap-3 text-[1.8rem] text-blue">
    <span className="text-[2rem]">{icon}</span>
    {title}
  </h2>
);
