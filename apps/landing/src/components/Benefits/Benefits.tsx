import cn from 'classnames';
import Container from '../Container/Container';
import s from './Benefits.module.css';
import Octahedron from './assets/1.svg?react';
import Shield from './assets/2.svg?react';
import Dots from './assets/3.svg?react';

interface IBenefitsProps {
  className?: string;
}

const content = [
  {
    icon: <Octahedron className={s.icon} />,
    title: 'Decentralized',
    text: 'Access an immutable money market directly on-chain.',
  },
  {
    icon: <Shield className={s.icon} />,
    title: 'BEP-20/ERC-20',
    text: 'All Venus Protocol assets are bound by the BEP-20 and ERC-20 standards.',
  },
  {
    icon: <Dots className={s.icon} />,
    title: 'Omnichain',
    text: 'Built on EVM-compatible chains for fast, secure, and low cost transactions.',
  },
];

const Benefits: React.FC<IBenefitsProps> = ({ className }) => (
  <Container className={cn(s.root, className)}>
    <ul className={s.list}>
      {content.map(({ icon, title, text }) => (
        <li className={s.benefitItem} key={text}>
          {icon}
          <div className={s.textWrapper}>
            <h3 className={s.title}>{title}</h3>
            <p className={s.text}>{text}</p>
          </div>
        </li>
      ))}
    </ul>
  </Container>
);

export default Benefits;
