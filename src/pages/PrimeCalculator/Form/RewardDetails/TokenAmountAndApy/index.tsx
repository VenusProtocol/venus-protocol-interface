import { Icon, Tooltip } from 'components';

interface TokenAmountAndApyProps {
  apy: string;
  apyTitle: string;
  apyTooltip: string;
  tokenAmountTitle: string;
  tokenAmount: string;
}

const TokenAmountAndApy = ({
  apy,
  apyTitle,
  apyTooltip,
  tokenAmount,
  tokenAmountTitle,
}: TokenAmountAndApyProps) => (
  <div className="flex">
    <div className="flex w-[110px] flex-col sm:w-35 md:w-[110px] lg:w-40">
      <span className="text-grey">{tokenAmountTitle}</span>
      <span>{tokenAmount}</span>
    </div>
    <Icon name="blueArrowRight" className="mx-6 self-center lg:mx-3" />
    <div className="flex flex-col">
      <div className="flex">
        <span className="mr-2 text-grey">{apyTitle}</span>
        <Tooltip className="flex flex-col justify-center" title={apyTooltip}>
          <Icon name="info" />
        </Tooltip>
      </div>
      <span>{apy}</span>
    </div>
  </div>
);

export default TokenAmountAndApy;
