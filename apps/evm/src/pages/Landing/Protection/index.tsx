import { cn } from 'components';

interface IProtectionProps {
  className?: string;
}

const itemClassName =
  'flex flex-1 flex-col min-h-105 justify-between p-6 pb-0 border border-solid border-lightGrey rounded-3xl sm:min-h-100 xl:min-h-139 xl:p-10 xl:pb-0';
const bgImgClassName = 'bg-contain bg-bottom bg-no-repeat flex-1';

const Protection: React.FC<IProtectionProps> = ({ className }) => (
  <div className={cn('Container', 'mt-15 md:mt-20 lg:mt-25', className)}>
    <ul className={'flex flex-col justify-between gap-6 sm:flex-row xl:gap-8'}>
      <li
        className={cn(
          itemClassName,
          'bg-radial-[62.14%_57.90%_at_50.00%_50.00%,rgba(23,46,98,0.50)_0%,rgba(18,22,32,0.50)_100%]',
        )}
        key="bounty"
      >
        <div className={'xl:mb-21'}>
          <h2 className="mb-4">Challenge our code and be rewarded</h2>
          <p className="mb-8 md:mb-0">
            We encourage all to challenge our code and search for vulnerabilities. Read about our{' '}
            bug bounty rewards, and please submit any bug you identify.
          </p>
        </div>
        <div className={cn(bgImgClassName, 'bg-[url(/images/landing/protection/bugBounty.png)]')} />
      </li>
      <li
        className={cn(
          itemClassName,
          'bg-radial-[62.14%_57.90%_at_50.00%_50.00%,rgba(30,75,100,0.50)_0%,rgba(18,22,32,0.50)_100%]',
        )}
        key="protection"
      >
        <div className={'xl:mb-21'}>
          <h2 className="mb-4">Protection prioritized</h2>
          <p className="mb-8 md:mb-0">
            Maintaining a fallback pool to keep us all safe in the case of outlier events
          </p>
        </div>
        <div
          className={cn(bgImgClassName, 'bg-[url(/images/landing/protection/protection.png)]')}
        />
      </li>
    </ul>
  </div>
);

export default Protection;
