import { Form } from './Form';
import { RewardDetails } from './RewardDetails';

const PrimeSimulator: React.FC = () => (
  <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
    <Form />

    <RewardDetails />
  </div>
);

export default PrimeSimulator;
