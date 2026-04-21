const scrollToElement = (elementId: string) => {
  document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' });
};

export default scrollToElement;
