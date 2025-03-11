import { cn } from '@venusprotocol/ui';
import s from './Safety.module.css';
import Score90 from './assets/score90.svg?react';

interface ISafetyProps {
  className?: string;
}

const SafetyScore: React.FC<ISafetyProps> = ({ className }) => (
  <div className={cn(s.card, s.cardScore, className)}>
    <div className={s.cardScoreContent}>
      <div className={s.securityScore}>
        <Score90 />
        <span>Security Score</span>
      </div>

      <p className={s.scored}>
        Venus scored <a href="https://skynet.certik.com/projects/venus">3rd highest</a> for security
        on BNB Chain as assessed by Certik (June, 2021)
      </p>
    </div>
  </div>
);

export default SafetyScore;
