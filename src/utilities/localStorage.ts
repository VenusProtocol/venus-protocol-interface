export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');

    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const saveState = (state: $TSFixMe) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (err) {
    return err;
  }
  return true;
};
