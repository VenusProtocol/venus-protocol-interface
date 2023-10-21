import initializeBigNumber from './bigNumber';
import initializeSentry from './sentry';
import initializeYup from './yup';

const initializeLibraries = () => {
  initializeBigNumber();
  initializeYup();
  initializeSentry();
};

export default initializeLibraries;
