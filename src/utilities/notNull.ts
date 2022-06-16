const notNull = <TValue>(value: TValue | null): value is TValue => value !== null;

export default notNull;
