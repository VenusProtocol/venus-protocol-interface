import useMediaQuery from '@mui/material/useMediaQuery';
import { useIsMdDown } from 'hooks/responsive';
import { Meteors } from './Meteors';
import { StarCanvas } from './StarCanvas';
import { StillStars } from './StillStars';
import './starfield.css';

export const Starfield: React.FC = () => {
  const isCompact = useIsMdDown();
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isStill = isCompact || prefersReducedMotion;

  return (
    <div className="venus-starfield" aria-hidden="true">
      {isStill ? (
        <div className="venus-starfield__still-layer">
          <StillStars />
        </div>
      ) : (
        <div className="venus-starfield__motion">
          <StarCanvas />
        </div>
      )}

      {!prefersReducedMotion && <Meteors />}
    </div>
  );
};
