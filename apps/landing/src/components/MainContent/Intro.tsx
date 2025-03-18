import { useBreakpointUp } from '@venusprotocol/ui';
import { APP_MAIN_PRODUCTION_URL } from '../../constants/production';
import Container from '../Container/Container';
import Link from '../Link';
import { BerachainAd } from './BerachainAd';
import s from './Intro.module.css';
import IconArrow from './assets/arrow.svg?react';

const links = [
  {
    text: 'Supply',
    href: APP_MAIN_PRODUCTION_URL,
  },
  {
    text: 'Borrow',
    href: APP_MAIN_PRODUCTION_URL,
  },
];

function Intro() {
  const isMdUp = useBreakpointUp('md');

  return (
    <div className={s.intro}>
      {!isMdUp && <BerachainAd />}

      <Container className={s.container}>
        <h1 className={s.title}>
          Universal <br />
          Money Markets
        </h1>

        <p className={s.description}>
          Simple and powerful community-driven finance <br className={s.break} />
          for the entire globe.
        </p>

        <div className={s.cta}>
          <Link className={s.linkLaunchApp} href={APP_MAIN_PRODUCTION_URL}>
            Launch app
          </Link>

          <div className="flex items-center">
            {links.map(({ text, href }) => (
              <div
                className="px-6 border-r border-offWhite/10 first-of-type:pl-0 last-of-type:pr-0 last-of-type:border-r-0"
                key={text}
              >
                <Link
                  className="group text-offWhite tracking-widest h-auto hover:text-offWhite"
                  variant="text"
                  key={text}
                  href={href}
                >
                  {text}

                  <IconArrow className="ml-3 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Intro;
