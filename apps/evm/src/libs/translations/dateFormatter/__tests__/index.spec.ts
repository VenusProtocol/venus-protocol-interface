import { t } from 'libs/translations';

import { dateFormatter } from '..';

const date = new Date('2026-01-02T03:04:05Z');

describe('dateFormatter', () => {
  it('returns non-date values unchanged', () => {
    expect(dateFormatter.format('value', 'textual', 'en', {})).toBe('value');
  });

  it('formats dates with the named format of the language', () => {
    expect(dateFormatter.format(date, 'textual', 'en', {})).toMatchInlineSnapshot(`"Jan 2, 2026"`);
  });

  it('formats dates interpolated in translations', () => {
    expect(
      t('requestWithdrawalFromVestingVaultForm.withdrawalRequestList.locked', { date }),
    ).toMatchInlineSnapshot(`"Locked until Jan 2, 2026 3:04 AM"`);
  });
});
