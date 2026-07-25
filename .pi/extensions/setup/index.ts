import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';
import { SetupExtension } from './SetupExtension';

export default function setup(pi: ExtensionAPI) {
  new SetupExtension(pi).register();
}
