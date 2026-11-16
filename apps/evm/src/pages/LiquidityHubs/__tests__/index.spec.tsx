import { screen } from '@testing-library/react';
import type { Mock } from 'vitest';

import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { useGetLiquidityHubs } from 'clients/api';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';

import LiquidityHubs from '..';

const getStatValue = (label: string) =>
  screen.getAllByText(label)[0].parentElement?.nextElementSibling;

describe('LiquidityHubs', () => {
  it.each([
    ['loading', { isLoading: true, data: undefined }],
    ['failed', { isLoading: false, isError: true, data: undefined }],
  ])('shows placeholders in the header when the Hubs request has %s', (_, queryResult) => {
    (useGetLiquidityHubs as Mock).mockImplementation(() => queryResult);

    renderComponent(<LiquidityHubs />);

    expect(getStatValue(en.liquidityHubs.stats.totalSupply)).toHaveTextContent('-');
    expect(getStatValue(en.liquidityHubs.stats.totalLiquidity)).toHaveTextContent('-');
    expect(getStatValue(en.liquidityHubs.stats.hubs)).toHaveTextContent('-');
    expect(screen.queryByText('$0')).not.toBeInTheDocument();
  });

  it('shows the Hubs totals in the header once the Hubs have loaded', () => {
    (useGetLiquidityHubs as Mock).mockImplementation(() => ({
      isLoading: false,
      data: { liquidityHubs },
    }));

    renderComponent(<LiquidityHubs />);

    expect(getStatValue(en.liquidityHubs.stats.hubs)).toHaveTextContent(`${liquidityHubs.length}`);
  });
});
