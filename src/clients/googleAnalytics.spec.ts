import googleAnalytics from './googleAnalytics';

describe('Google Analytics Client', () => {
  let consoleSpy: jest.SpyInstance;
  beforeAll(() => {
    consoleSpy = jest.spyOn(console, 'warn');
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  test('event is called when gtag exists on window', () => {
    window.gtag = () => {};
    const spy = jest.spyOn(window, 'gtag');
    googleAnalytics.buttonPressed('connect_wallet');
    expect(spy).toHaveBeenCalled();
  });

  test('calling event does not crash when gtag does not exit window', () => {
    // @ts-expect-error gtag could be missing if script isn't loaded from document
    window.gtag = undefined;
    googleAnalytics.buttonPressed('connect_wallet');
    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy.mock.calls[0][1]).toStrictEqual([
      'button_pressed',
      { button_name: 'connect' },
    ]);
  });
});
