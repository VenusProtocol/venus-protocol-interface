interface SectionCardProps {
  children: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({ children }) => (
  <section className="rounded-xl border border-white/5 bg-white/[0.02] p-4 md:p-10">
    {children}
  </section>
);
