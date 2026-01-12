import { cn } from 'components';
import Octahedron from './assets/1.svg?react';
import Shield from './assets/2.svg?react';
import Dots from './assets/3.svg?react';

interface IBenefitsProps {
  className?: string;
}

const iconClassName = 'mb-[24px] sm:mb-0 sm:me-[24px] md:me-0 md:mb-[85px]';

const content = [
  {
    icon: <Octahedron className={iconClassName} />,
    title: 'Decentralized',
    text: 'Access an immutable money market directly on-chain.',
  },
  {
    icon: <Shield className={iconClassName} />,
    title: 'BEP-20/ERC-20',
    text: 'All Venus Protocol assets are bound by the BEP-20 and ERC-20 standards.',
  },
  {
    icon: <Dots className={iconClassName} />,
    title: 'Omnichain',
    text: 'Built on EVM-compatible chains for fast, secure, and low cost transactions.',
  },
];

const Benefits: React.FC<IBenefitsProps> = ({ className }) => (
  <div className={cn('Container', 'mt-15 md:mt-20 xl:mt-25', className)}>
    <ul className="md:flex md:gap-6">
      {content.map(({ icon, title, text }) => (
        <li
          className={
            'bg-background-secondary rounded-lg p-6 border border-solid border-lightGrey mt-4 first:mt-0 sm:flex sm:items-center md:w-1/3 md:flex-col md:items-start md:rounded-3xl md:mt-0'
          }
          key={text}
        >
          {icon}
          <div>
            <h3 className="text-[24px] m-0 mb-2">{title}</h3>
            <p className="m-0 text-grey">{text}</p>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default Benefits;
