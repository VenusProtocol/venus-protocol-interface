interface NoteBoxProps {
  children: React.ReactNode;
}

export const NoteBox: React.FC<NoteBoxProps> = ({ children }) => (
  <div className="my-5 rounded-md border-l-[3px] border-yellow bg-yellow/10 px-5 py-4 text-yellow">
    {children}
  </div>
);
