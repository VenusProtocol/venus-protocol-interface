import { renderComponent } from 'testUtils/render';

import { SubMenuContent } from '..';

const makeItems = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    to: `/item-${index}`,
    label: `Item ${index}`,
    description: `Description ${index}`,
  }));

describe('SubMenuContent', () => {
  it('stacks two secondary items in one column', () => {
    const { container } = renderComponent(
      <SubMenuContent label="Earn" variant="secondary" items={makeItems(2)} />,
    );

    expect(container.querySelector('.sm\\:grid-cols-2')).toBeNull();
    expect(container.querySelector('.sm\\:min-w-79')).not.toBeNull();
  });

  it('stacks more than two secondary items in one column', () => {
    const { container } = renderComponent(
      <SubMenuContent label="Borrow" variant="secondary" items={makeItems(3)} />,
    );

    expect(container.querySelector('.sm\\:grid-cols-2')).toBeNull();
    expect(container.querySelector('.sm\\:min-w-79')).not.toBeNull();
  });
});
