import { IPlayerProps, Player } from '@lottiefiles/react-lottie-player';
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
  autoplay = !process.env.STORYBOOK,
  loop = true,
  className,
}) => {
  const src = files[name];
  return <Player className={className} autoplay={autoplay} loop={loop} src={src} />;
};

export const Spinner: React.FC<Omit<LottieAnimationProps, 'name'>> = props => (
  <LottieAnimation name="spinner" {...props} />
);

export default LottieAnimation;
