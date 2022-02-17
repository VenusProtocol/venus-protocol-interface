declare module '*.png' {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const value: any;
  export default value;
}

declare module '*.svg' {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const value: any;
  export default value;
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
