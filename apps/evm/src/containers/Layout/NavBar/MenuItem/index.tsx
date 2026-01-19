import { cn } from '@venusprotocol/ui';
import { matchPath, useLocation } from 'react-router';

import { AccordionAnimatedContent, Dropdown, Icon } from 'components';
import { Link } from 'containers/Link';
import { useState } from 'react';
import type { MenuItem as MenuItemType, SubMenu } from '../types';
import { SubMenuContent } from './SubMenuContent';
import type { SubMenuItemProps } from './SubMenuContent/SubMenuItem';

export interface MenuItemProps {
  item: MenuItemType | SubMenu;
  onClick: () => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({ item, onClick }) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const { pathname } = useLocation();

  let isActive = false;

  if ('to' in item && item.to) {
    isActive = !!matchPath(item.to, pathname);
  } else if ('items' in item) {
    isActive = item.items.some(i => i.to && matchPath(i.to, pathname));
  }

  const sharedContainerClassName = cn(
    'block w-full text-left py-3 font-semibold text-light-grey transition-colors hover:no-underline hover:text-light-grey-hover active:text-light-grey-active xl:font-normal xl:px-4 xl:py-3 xl:rounded-lg xl:hover:text-white xl:hover:bg-dark-blue-active xl:whitespace-nowrap',
    isActive && 'xl:bg-dark-blue-active xl:text-white',
  );

  // Toggle menu's open state
  const onAccordionTriggerClick = () => setIsSubMenuOpen(value => !value);

  return 'items' in item ? (
    <div>
      {/* XL and up backdrop */}
      {isSubMenuOpen && (
        <div
          className="fixed bottom-0 left-0 right-0 top-0 hidden z-50 xl:block"
          onClick={() => setIsSubMenuOpen(false)}
        />
      )}

      {/* Mobile/tablet submenu */}
      <div className="xl:hidden">
        <button
          className={cn(
            sharedContainerClassName,
            'flex items-center justify-between cursor-pointer xl:gap-x-2',
          )}
          type="button"
          onClick={onAccordionTriggerClick}
        >
          <span className="whitespace-nowrap">{item.label}</span>

          <Icon
            name="chevronDown"
            className={cn('size-3 shrink-0', isSubMenuOpen && 'rotate-180')}
          />
        </button>

        <AccordionAnimatedContent isOpen={isSubMenuOpen} className="pb-3 xl:hidden">
          <SubMenuContent
            {...item}
            items={item.items.map(i => ({
              ...i,
              onClick: () => {
                // Close submenu
                setIsSubMenuOpen(false);

                onClick();
              },
            }))}
          />
        </AccordionAnimatedContent>
      </div>

      {/* XL and up dropdown */}
      <Dropdown
        className="hidden xl:block"
        menuClassName="top-7 shadow-none border-0 bg-background-active"
        optionsDom={({ setIsDropdownOpened }) => {
          const items: SubMenuItemProps[] = item.items.map(i => ({
            ...i,
            onClick: () => {
              // Close dropdown
              setIsDropdownOpened(false);

              onClick();
            },
          }));

          return <SubMenuContent {...item} items={items} />;
        }}
      >
        {({ isDropdownOpened, handleToggleDropdown }) => (
          <button
            className={cn(
              sharedContainerClassName,
              'flex items-center justify-between cursor-pointer xl:gap-x-2',
              isDropdownOpened && 'xl:text-white xl:bg-dark-blue-active',
            )}
            type="button"
            onClick={handleToggleDropdown}
          >
            <span>{item.label}</span>

            <Icon name="chevronDown" className={cn('size-3', isSubMenuOpen && 'rotate-180')} />
          </button>
        )}
      </Dropdown>
    </div>
  ) : (
    <Link to={item.to} href={item.href} onClick={onClick} className={sharedContainerClassName}>
      {item.label}
    </Link>
  );
};
