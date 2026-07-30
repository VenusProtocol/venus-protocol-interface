import { cn } from '@venusprotocol/ui';
import { matchPath, useLocation } from 'react-router';

import { AccordionAnimatedContent, Dropdown, Icon } from 'components';
import { Link } from 'containers/Link';
import { useState } from 'react';
import { Tag } from '../Tag';
import type { MenuItem as MenuItemType, SubMenu } from '../types';
import { SubMenuContent } from './SubMenuContent';
import type { SubMenuItemProps } from './SubMenuContent/SubMenuItem';

export interface MenuItemProps {
  item: MenuItemType | SubMenu;
  onClick: () => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({ item, onClick }) => {
  const { pathname } = useLocation();

  let isActive = false;

  if ('to' in item && item.to) {
    isActive = !!matchPath(item.to, pathname);
  } else if ('items' in item) {
    isActive = item.items.some(i => i.to && matchPath(i.to, pathname));
  }

  const [isSubMenuOpen, setIsSubMenuOpen] = useState(
    'items' in item ? isActive || !!item.defaultOpenOnMobile : false,
  );

  const sharedContainerClassName = cn(
    'block w-full text-left py-3 font-semibold text-light-grey transition-colors hover:no-underline hover:text-light-grey-hover active:text-light-grey-active lg:font-normal lg:px-4 lg:py-3 lg:rounded-lg lg:hover:text-white lg:hover:bg-dark-blue-active lg:whitespace-nowrap group-has-[[data-rewards-button]]/navbar:lg:px-2 group-has-[[data-rewards-button]]/navbar:xl:px-4',
    isActive && 'lg:bg-dark-blue-active lg:text-white',
  );

  // Toggle menu's open state
  const onAccordionTriggerClick = () => setIsSubMenuOpen(value => !value);

  return 'items' in item ? (
    <div>
      {/* Mobile/tablet submenu */}
      <div className="lg:hidden">
        <button
          className={cn(
            sharedContainerClassName,
            'flex items-center justify-between cursor-pointer lg:gap-x-2',
          )}
          type="button"
          onClick={onAccordionTriggerClick}
        >
          <div className="flex items-center gap-x-2">
            <span className="whitespace-nowrap">{item.label}</span>

            {!!item.tagLabel && <Tag>{item.tagLabel}</Tag>}
          </div>

          <Icon
            name="chevronDown"
            className={cn('size-3 shrink-0', isSubMenuOpen && 'rotate-180')}
          />
        </button>

        <AccordionAnimatedContent isOpen={isSubMenuOpen} className="pb-3 lg:hidden">
          <SubMenuContent
            {...item}
            items={item.items.map(i => ({
              ...i,
              onClick,
            }))}
          />
        </AccordionAnimatedContent>
      </div>

      {/* XL and up dropdown */}
      <Dropdown
        className="hidden lg:block"
        menuClassName="mt-5 shadow-none border-0 bg-background-active"
        triggerOnHover
        optionsDom={({ setIsDropdownOpen }) => {
          const items: SubMenuItemProps[] = item.items.map(i => ({
            ...i,
            onClick: () => {
              // Close dropdown
              setIsDropdownOpen(false);

              onClick();
            },
          }));

          return <SubMenuContent {...item} items={items} />;
        }}
      >
        {({ isDropdownOpen }) => (
          <button
            className={cn(
              sharedContainerClassName,
              'relative flex items-center justify-between cursor-pointer lg:gap-x-2',
              isDropdownOpen && 'lg:text-white lg:bg-dark-blue-active',
            )}
            type="button"
          >
            <span>{item.label}</span>

            <Icon name="chevronDown" className={cn('size-3', isDropdownOpen && 'rotate-180')} />

            {!!item.tagLabel && (
              <Tag className="absolute z-1 -top-2 -right-3 xl:-right-1">{item.tagLabel}</Tag>
            )}
          </button>
        )}
      </Dropdown>
    </div>
  ) : (
    <Link
      to={item.to}
      href={item.href}
      onClick={onClick}
      className={cn(sharedContainerClassName, 'flex items-center gap-x-2')}
    >
      <span>{item.label}</span>

      {item.tagLabel && (
        <Tag className="inline-block lg:hidden xl:inline-block">{item.tagLabel}</Tag>
      )}
    </Link>
  );
};
