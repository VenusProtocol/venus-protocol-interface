import { getIosBrowserName, getIosRisk, isIosRiskPhraseMatch } from '..';

const iphone = (os: string, tail: string) =>
  `Mozilla/5.0 (iPhone; CPU iPhone OS ${os} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) ${tail}`;

const safari = (os: string, version: string) =>
  iphone(os, `Version/${version} Mobile/15E148 Safari/604.1`);

const mac = (version: string) =>
  `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${version} Safari/605.1.15`;

const detect = (userAgent: string, maxTouchPoints = 5, supportsWebKit26 = false) =>
  getIosRisk({ userAgent, maxTouchPoints, supportsWebKit26 });

describe('getIosRisk', () => {
  it.each([
    ['iOS 17.1.2 Safari', safari('17_1_2', '17.1.2'), 'Coruna', '17.1.2'],
    ['iOS 17.2.1 Safari', safari('17_2_1', '17.2'), 'Coruna', '17.2.1'],
    ['iOS 18.6.2 Safari', safari('18_6_2', '18.6'), 'DarkSword', '18.6.2'],
    ['iOS 18.5 Trust Wallet in-app browser', iphone('18_5', 'Mobile/15E148'), 'DarkSword', '18.5'],
    ['iOS 18.7.3 Safari', safari('18_7_3', '18.7'), 'DarkSword', '18.7.3'],
    ['iOS 13.0 Safari', safari('13_0', '13.0'), 'Coruna', '13.0'],
    ['iPadOS 17.1 desktop mode', mac('17.1'), 'Coruna', '17.1'],
  ])('flags %s', (_, userAgent, kit, version) => {
    expect(detect(userAgent)).toMatchObject({ status: 'affected', kit, version });
  });

  it.each([
    ['iOS 17.3 Safari', safari('17_3', '17.3')],
    ['iOS 18.3.2 Safari', safari('18_3_2', '18.3')],
    ['iOS 18.8 Safari', safari('18_8', '18.8')],
    ['iOS 26.1 Safari with a frozen OS token', safari('18_6', '26.1')],
    ['iOS 26.1 Chrome', iphone('26_1_0', 'CriOS/142.0.0.0 Mobile/15E148 Safari/604.1')],
    ['iOS 12.5 Safari', safari('12_5', '12.5')],
  ])('does not flag %s', (_, userAgent) => {
    expect(detect(userAgent)).toBeUndefined();
  });

  it('does not flag a Mac without touch support', () => {
    expect(detect(mac('17.1'), 0)).toBeUndefined();
  });

  it('does not flag Android', () => {
    expect(
      detect(
        'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',
      ),
    ).toBeUndefined();
  });

  it('trusts the WebKit 26 engine check over a frozen user agent', () => {
    expect(detect(iphone('18_5', 'Mobile/15E148'), 5, true)).toBeUndefined();
  });

  it('reports an iOS user agent without a readable version', () => {
    expect(detect('Mozilla/5.0 (iPhone; CPU iPhone like Mac OS X) Mobile/15E148')).toEqual({
      status: 'unreadable',
    });
  });

  it('returns the affected range of the kit', () => {
    expect(detect(safari('18_6_2', '18.6'))).toMatchObject({ from: '18.4', to: '18.7' });
  });
});

describe('getIosBrowserName', () => {
  it.each([
    [safari('17_1_2', '17.1.2'), 'Safari'],
    [iphone('17_1_2', 'CriOS/142.0.0.0 Mobile/15E148 Safari/604.1'), 'Chrome'],
    [iphone('17_1_2', 'FxiOS/140.0 Mobile/15E148 Safari/605.1.15'), 'Firefox'],
    [iphone('17_1_2', 'EdgiOS/140.0 Version/17.0 Mobile/15E148 Safari/604.1'), 'Edge'],
    [iphone('18_5', 'Mobile/15E148'), 'In-app browser'],
  ])('names the browser of %s', (userAgent, name) => {
    expect(getIosBrowserName(userAgent)).toBe(name);
  });
});

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
