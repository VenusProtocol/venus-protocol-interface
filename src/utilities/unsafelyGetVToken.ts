import { VBEP_TOKENS } from 'constants/tokens';

/**
 * @deprecated This method is unsafe since it assumes ID passed is always correct
 * see: VEN-723
 */
export const unsafelyGetVToken = (id: string) => VBEP_TOKENS[id as keyof typeof VBEP_TOKENS];

export default unsafelyGetVToken;
