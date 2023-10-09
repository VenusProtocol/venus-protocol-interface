// import ClaimRewardButton from '../ClaimRewardButton';
import { Icon, TertiaryButton } from 'components';
import { useState } from 'react';
import { useTranslation } from 'translation';

import venusLogoSrc from 'assets/img/venusLogo.svg';
import { PAGE_CONTAINER_ID } from 'constants/layout';

import ConnectButton from '../ConnectButton';

export const Menu: React.FC = () => {
  const { t } = useTranslation();
  const [isMobileMenuOpened, setIsMobileMenuOpened] = useState<boolean>(false);
  const toggleMobileMenu = () => {
    // Toggle scroll on page container and body tags
    const pageContainerDom = document.getElementById(PAGE_CONTAINER_ID);
    pageContainerDom?.classList.toggle('overflow-hidden');
    document.body.classList.toggle('overflow-hidden');

    setIsMobileMenuOpened(currentIsMobileMenuOpened => !currentIsMobileMenuOpened);
  };

  return (
    <>
      <header className="flex h-14 items-center px-4">
        <img src={venusLogoSrc} alt={t('layout.menu.venusLogoAlt')} className="mr-8 w-9" />

        <ConnectButton className="h-9 w-full" />

        <TertiaryButton
          onClick={toggleMobileMenu}
          className="ml-8 h-9 w-9 flex-none p-0 hover:border-lightGrey active:border-lightGrey"
        >
          <Icon
            name={isMobileMenuOpened ? 'closeRounded' : 'burger'}
            className="h-auto w-[18px] text-offWhite"
          />
        </TertiaryButton>
      </header>

      {isMobileMenuOpened && (
        <div className="fixed bottom-0 left-0 right-0 top-14 z-50 bg-background">hey</div>
      )}
    </>
  );
};
