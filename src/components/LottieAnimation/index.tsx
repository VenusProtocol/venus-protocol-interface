import { IPlayerProps, Player } from '@lottiefiles/react-lottie-player';
import config from 'config';
import React from 'react';

import * as files from './files';

export type FileName = keyof typeof files;

export interface LottieAnimationProps {
  name: FileName;
  className?: string;
  autoplay?: IPlayerProps['autoplay'];
  loop?: IPlayerProps['loop'];
}

export const LottieAnimation: React.FC<LottieAnimationProps> = ({
  name,
  autoplay = config.environment !== 'ci',
  loop = true,
  className,
}) => {
  const src = files[name];
  return <Player className={className} autoplay={autoplay} loop={loop} src={src} />;
};

export const Spinner: React.FC<Omit<LottieAnimationProps, 'name'>> = props => (
  <LottieAnimation name="spinner" {...props} />
);

export const GreenPulse: React.FC<Omit<LottieAnimationProps, 'name'>> = props => (
  <LottieAnimation name="greenPulse" {...props} />
);

export default LottieAnimation;
