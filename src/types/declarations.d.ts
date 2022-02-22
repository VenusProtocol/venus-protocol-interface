declare module '*.png' {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const value: any;
  export default value;
}

declare module '*.svg' {
  import React = require('react');

  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.jpg' {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const value: any;
  export default value;
}

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

declare module 'emotion-theming';
