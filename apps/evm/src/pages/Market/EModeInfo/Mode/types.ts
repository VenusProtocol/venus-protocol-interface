import type { EModeAssetSettings, EModeGroup, Pool } from 'types';

export interface ExtendedEModeAssetSettings extends EModeAssetSettings {
  eModeGroup: EModeGroup;
  isEnabledByUser: boolean;
}

export interface ModeProps {
  title: string;
  tooltip?: string;
  pool: Pool;
  eModeAssetSettings: ExtendedEModeAssetSettings[];
}
