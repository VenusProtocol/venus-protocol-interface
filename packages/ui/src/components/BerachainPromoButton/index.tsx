import { cn } from '../../utilities/cn';
import type { ButtonAltComponentType, ButtonProps } from '../Button';
import background from './background.jpg';
import leftHoneyDrip from './leftHoneyDrip.png';
import rightHoneyDrip from './rightHoneyDrip.png';

export type BerachainPromoButtonProps<T extends ButtonAltComponentType> = ButtonProps<T>;

export const BerachainPromoButton = <T extends ButtonAltComponentType>({
  children,
  className,
  component,
  ...otherProps
}: BerachainPromoButtonProps<T>) => {
  const Comp = component ?? 'button';

  return (
    <Comp
      className={cn(
        'relative group relative overflow-hidden inline-flex justify-center items-center h-12 cursor-pointer rounded-lg px-6 py-2 font-semibold bg-cover bg-center transition-shadow duration-300 hover:shadow-[0_0_6px_0_rgba(255,246,139,0.7)]',
        className,
      )}
      style={{
        backgroundImage: `url('${background}')`,
      }}
      {...otherProps}
    >
      <>
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF68B] via-[rgba(248,169,5,0.8)] via-70% to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF68B] via-70% to-[rgba(255,246,139,0.1)] via-[rgba(255,246,139,0.4)] backdrop-blur-[1px] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <img src={leftHoneyDrip} alt="" className="absolute left-0 top-0 h-8" />
        <img src={rightHoneyDrip} alt="" className="absolute right-0 top-0 h-4" />

        <span className="relative text-background">{children}</span>
      </>
    </Comp>
  );
};
