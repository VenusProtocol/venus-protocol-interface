import { renderComponent } from 'testUtils/render';

import { en } from 'libs/translations';
import { SubMenuContent } from '..';

const makeItems = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    to: `/item-${index}`,
    label: `Item ${index}`,
    description: `Description ${index}`,
  }));

describe('SubMenuContent', () => {
  it('lays secondary items out in two columns on tablet and one column on desktop', () => {
    const { container } = renderComponent(
      <SubMenuContent label="Earn" variant="secondary" items={makeItems(2)} />,
    );

    expect(container.querySelector('.sm\\:grid-cols-2.lg\\:grid-cols-1')).not.toBeNull();
  });

  it('makes each whole secondary item the link, without a Get started button', () => {
    const { container, getAllByRole } = renderComponent(
      <SubMenuContent label="Borrow" variant="secondary" items={makeItems(2)} />,
    );

    expect(getAllByRole('link')).toHaveLength(2);
    expect(container.textContent).not.toContain('Get started');
    expect(Object.keys(en.layout.menu)).not.toContain('subMenuItem');
  });

  it.each([
    ['core', 'Venus Core', 'core-end'],
    ['liquidityHub', 'Liquidity Hub', 'hub-center'],
    ['vault', 'Venus Vault', 'vault-dial'],
    ['spoke', 'Venus Spoke', 'spoke-up'],
  ] as const)(
    'renders the %s menu icon inline so its parts animate on hover',
    (menuIconName, label, animatedPart) => {
      const { container, getByRole } = renderComponent(
        <SubMenuContent
          label="Earn"
          variant="secondary"
          items={[{ to: '/item', label, menuIconName }]}
        />,
      );

      expect(getByRole('img', { name: label }).tagName.toLowerCase()).toBe('svg');
      expect(getByRole('link')).toHaveAttribute('data-nav-item');
      expect(container.querySelector(`[data-nav-part="${animatedPart}"]`)).not.toBeNull();
    },
  );
});
