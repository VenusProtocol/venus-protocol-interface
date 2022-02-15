export function createPromiseAction(actionType: $TSFixMe) {
  // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'payload' implicitly has an 'any' type.
  return (payload, resolve, reject) => ({
    type: actionType,
    payload,
    resolve,
    reject,
  });
}
