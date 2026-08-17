import { RatesApyChart } from './RatesApyChart';
import { StablecoinDominanceChart } from './StablecoinDominanceChart';
import { StablecoinRatesChart } from './StablecoinRatesChart';
import { StablecoinTotalsChart } from './StablecoinTotalsChart';

export const Rates: React.FC = () => (
  <div className="flex flex-col gap-6 pb-12">
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <RatesApyChart metric="supply" />
      <RatesApyChart metric="borrows" />
    </div>
    <StablecoinRatesChart />
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <StablecoinDominanceChart metric="supply" />
      <StablecoinDominanceChart metric="borrows" />
    </div>
    <StablecoinTotalsChart />
  </div>
);
