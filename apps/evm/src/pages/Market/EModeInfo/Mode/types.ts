import type { EModeAssetSettings, EModeGroup, Pool } from 'types';

export interface ExtendedEModeAssetSettings extends EModeAssetSettings {
  eModeGroup: EModeGroup;
}

export interface ModeProps {
  title: string;
  pool: Pool;
  eModeAssetSettings: ExtendedEModeAssetSettings[];
}
