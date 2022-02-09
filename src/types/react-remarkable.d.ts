// / <reference types="react" />
// / <reference types="remarkable" />

declare module 'react-remarkable' {
  interface RemarkableProps {
    options?: Remarkable.Remarkable.Options;
    container?: string | JSX.Element;
    source?: string;
    children?: string;
  }

  declare class ReactRemarkable extends React.Component<RemarkableProps> {}

  export default ReactRemarkable;
}
