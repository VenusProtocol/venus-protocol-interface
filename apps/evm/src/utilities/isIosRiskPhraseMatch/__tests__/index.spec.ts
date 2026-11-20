import { isIosRiskPhraseMatch } from '..';

describe('isIosRiskPhraseMatch', () => {
  it.each(['I understand the risks', '  i UNDERSTAND   the risks.  ', 'I understand the risks.'])(
    'accepts "%s"',
    value => {
      expect(isIosRiskPhraseMatch(value)).toBe(true);
    },
  );

  it.each(['', 'I understand the risk', 'I understand the risks!', 'I understand'])(
    'rejects "%s"',
    value => {
      expect(isIosRiskPhraseMatch(value)).toBe(false);
    },
  );
});
