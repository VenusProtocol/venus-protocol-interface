import React from 'react';
import { Player, IPlayerProps } from '@lottiefiles/react-lottie-player';
import * as files from './files';

export type FileName = keyof typeof files;

export interface ILottieAnimationProps {
  name: FileName;
  className?: string;
  autoplay?: IPlayerProps['autoplay'];
  loop?: IPlayerProps['loop'];
}

export const LottieAnimation: React.FC<ILottieAnimationProps> = ({
  name,
  autoplay = !process.env.STORYBOOK,
  loop = true,
  className,
}) => {
  const src = files[name];
  return <Player className={className} autoplay={autoplay} loop={loop} src={src} />;
};

export const Spinner: React.FC<Omit<ILottieAnimationProps, 'name'>> = props => (
  <LottieAnimation name="spinner" {...props} />
);

export default LottieAnimation;
