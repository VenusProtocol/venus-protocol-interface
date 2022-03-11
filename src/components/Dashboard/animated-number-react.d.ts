// / <reference types="react" />

declare module 'animated-number-react' {
  interface AnimatedNumberReactProps {
    value: number | PropTypes.string;
    duration?: number;
    delay?: number;
    formatValue: (value: string) => void;
    begin?: () => void;
    complete?: () => void;
    run?: () => void;
    update?: () => void;
    easing?: string;
    className?: string;
  }

  declare class AnimatedNumberReact extends React.Component<AnimatedNumberReactProps> {}

  export default AnimatedNumberReact;
}
