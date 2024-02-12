const notUndefined = <TValue>(value: TValue | undefined): value is TValue => value !== undefined;

export default notUndefined;
