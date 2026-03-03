interface StepItemProps {
  step: number;
  children: React.ReactNode;
}

export const StepItem: React.FC<StepItemProps> = ({ step, children }) => (
  <li className="my-4 rounded-md border-l-[3px] border-blue bg-blue/5 px-5 py-4">
    <span className="mr-3 inline-block h-7 w-7 rounded-full bg-blue text-center text-[0.9rem] leading-7 font-bold text-background">
      {step}
    </span>
    {children}
  </li>
);
