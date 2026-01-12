import { cn } from 'components';
import { Link } from 'containers/Link';
import scoreImg from './assets/score.svg';
import Score90 from './assets/score90.svg?react';
interface ISafetyProps {
  className?: string;
}

const SafetyScore: React.FC<ISafetyProps> = ({ className }) => (
  <div
    className={cn(
      'relative flex flex-col items-center bg-[#1E2431] rounded-3xl p-6 md:px-12 xl:w-[375px] xl:p-6 xl:pb-4',
      className,
    )}
  >
    <div className="relative w-full max-w-[580px] mx-auto flex flex-col justify-center items-center gap-6 sm:flex-row xl:flex-col">
      <div className="relative flex flex-col justify-center items-center h-[140px] w-[220px] text-center xl:h-[180px] xl:w-[180px]">
        <Score90 />
        <span className="text-grey text-center text-[0.625rem] font-normal leading-4.5 mt-1.5 no-underline">
          Security Score
        </span>
        <img loading="lazy" className="absolute" src={scoreImg} alt="score" />
      </div>

      <p className="m-0 text-base text-grey leading-6 text-center sm:text-left xl:text-[0.875rem] xl:text-center">
        <span>Venus scored </span>
        <Link href="https://skynet.certik.com/projects/venus">3rd highest</Link>
        <span> for security on BNB Chain as assessed by Certik (June, 2021)</span>
      </p>
    </div>
  </div>
);

export default SafetyScore;
