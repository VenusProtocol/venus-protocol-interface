import { cn } from 'components';
import { Link } from 'containers/Link';

const VenusPrime: React.FC = () => (
  <div className="Container mt-15 md:mt-20 xl:mt-25">
    <div
      className={cn(
        'flex flex-col border border-solid border-lightGrey rounded-3xl bg-background-secondary p-6',
        "sm:bg-[url('/images/landing/venusPrime/venusPrimeLogo640.png')] sm:flex-row sm:h-100",
        "md:bg-[url('/images/landing/venusPrime/venusPrimeLogo840.png')]",
        "xl:bg-[url('/images/landing/venusPrime/venusPrimeLogo1280.png')]",
        'bg-left bg-no-repeat bg-contain',
      )}
      key="bounty"
    >
      <div className="hidden sm:flex min-h-50 w-full flex-1 bg-[url('/images/landing/venusPrime/venusPrimeLogo375.png')] bg-left bg-no-repeat bg-contain" />
      <div className={cn('flex flex-col', 'sm:ms-60 md:ms-105 xl:ms-147.5')}>
        <h2 className="m-0 mt-7.5 mb-6">
          <span className="bg-linear-to-t from-[#8E6150] to-[#F2E3DB] bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] text-[#8E6150]">
            Venus Prime
          </span>{' '}
          rewards loyalty
          <br /> with superior rewards
        </h2>
        <p className="m-0 mb-10">
          With Venus Prime, dedicated users obtain boosted rewards when they lend and borrow on
          Venus while staking in the governance vault.
        </p>
        <Link className="w-fit LandingLink" href="https://docs-v4.venus.io/whats-new/prime-yield">
          Learn more
        </Link>
      </div>
    </div>
  </div>
);

export default VenusPrime;
