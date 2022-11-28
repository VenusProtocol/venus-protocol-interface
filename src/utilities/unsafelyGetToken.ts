import { TOKENS } from 'constants/tokens';

/**
 * @deprecated This method is unsafe since it assumes ID passed is always correct
 * see: VEN-723
 */
export const unsafelyGetToken = (id: string) => TOKENS[id as keyof typeof TOKENS];

export default unsafelyGetToken;
