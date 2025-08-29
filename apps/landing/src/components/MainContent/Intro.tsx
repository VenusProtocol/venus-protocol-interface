import LinkLaunchApp from '../Link/LinkLaunchApp';
import s from './Intro.module.css';

function Intro() {
  return (
    <div className={s.intro}>
      <h1 className={s.title}>
        Universal <br />
        Money Markets
      </h1>

      <p className={s.description}>
        Simple and powerful community-driven finance <br className={s.break} />
        for the entire globe.
      </p>

      <LinkLaunchApp />
    </div>
  );
}

export default Intro;
