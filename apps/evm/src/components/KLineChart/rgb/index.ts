export const rgb = (cssVariableName: string) => {
  const computedValue =
    typeof window === 'undefined'
      ? ''
      : getComputedStyle(document.documentElement).getPropertyValue(cssVariableName).trim();

  return `rgb(${computedValue})`;
};
