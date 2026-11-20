import { getIosBrowserName } from '..';

const iphone = (os: string, tail: string) =>
  `Mozilla/5.0 (iPhone; CPU iPhone OS ${os} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) ${tail}`;

const safari = (os: string, version: string) =>
  iphone(os, `Version/${version} Mobile/15E148 Safari/604.1`);

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
