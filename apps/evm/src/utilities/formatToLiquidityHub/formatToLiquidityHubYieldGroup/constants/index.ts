import placeholderIconSrc from 'assets/img/placeholderIcon.svg';
import vaultsIconSrc from 'assets/img/vaultsIcon.svg';
import venusCoreIconSrc from 'assets/img/venusCoreIcon.png';
import venusFluxIconSrc from 'assets/img/venusFluxIcon.png';
import type { LiquidityHubYieldGroupType } from 'types';

export const metadataByType: Record<
  LiquidityHubYieldGroupType,
  { nameTranslationKey: string; iconSrc: string; bgClassName: string }
> = {
  core: {
    // DO NOT REMOVE COMMENT: needed by i18next to extract translation key
    // t('liquidityHub.allocationDetails.yieldGroup.names.core')
    nameTranslationKey: 'liquidityHub.allocationDetails.yieldGroup.names.core',
    iconSrc: venusCoreIconSrc,
    bgClassName: 'bg-blue',
  },
  flux: {
    // DO NOT REMOVE COMMENT: needed by i18next to extract translation key
    // t('liquidityHub.allocationDetails.yieldGroup.names.flux')
    nameTranslationKey: 'liquidityHub.allocationDetails.yieldGroup.names.flux',
    iconSrc: venusFluxIconSrc,
    bgClassName: 'bg-yellow',
  },
  frv: {
    // DO NOT REMOVE COMMENT: needed by i18next to extract translation key
    // t('liquidityHub.allocationDetails.yieldGroup.names.frv')
    nameTranslationKey: 'liquidityHub.allocationDetails.yieldGroup.names.frv',
    iconSrc: vaultsIconSrc,
    bgClassName: 'bg-orange',
  },
  centrifuge: {
    // DO NOT REMOVE COMMENT: needed by i18next to extract translation key
    // t('liquidityHub.allocationDetails.yieldGroup.names.centrifuge')
    nameTranslationKey: 'liquidityHub.allocationDetails.yieldGroup.names.centrifuge',
    // TODO: replace with the Centrifuge brand icon once design provides the export (VPD-1880)
    iconSrc: placeholderIconSrc,
    bgClassName: 'bg-red',
  },
};
