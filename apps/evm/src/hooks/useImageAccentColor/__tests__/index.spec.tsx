import * as path from 'node:path';
import { waitFor } from '@testing-library/react';
import { renderHook } from 'testUtils/render';

import { useImageAccentColor } from '..';

describe('useImageAccentColor', () => {
  it('extract the accent color of an image correctly', async () => {
    const { result } = renderHook(() =>
      useImageAccentColor({
        imagePath: path.join(__dirname, './alpaca.png'),
      }),
    );

    await waitFor(() => expect(result.current.color).toBeDefined());
    expect(result.current).toMatchInlineSnapshot(`
      {
        "color": "#34c47c",
      }
    `);
  });
});
