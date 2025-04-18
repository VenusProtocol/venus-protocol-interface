import { renderComponent } from 'testUtils/render';
import { HealthFactor } from '..';
import { HEALTH_FACTOR_MAX_VALUE } from '../formatHealthFactorToReadableValue';

describe('HealthFactor', () => {
  it.each([
    Number.POSITIVE_INFINITY,
    HEALTH_FACTOR_MAX_VALUE + 1,
    12.23123,
    2.912312,
    1.989765,
    0.8738529,
  ])('displays correct UI for factor: %s', factor => {
    const { container: base } = renderComponent(<HealthFactor factor={factor} />);

    expect(base.textContent).toMatchSnapshot();
  });
});
