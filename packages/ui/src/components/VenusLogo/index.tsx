import { ChainId } from '@venusprotocol/chains';
import BerachainVenusLogo from './berachainVenusLogo.svg';
import BerachainVenusLogoWithText from './berachainVenusLogoWithText.svg';
import UnichainVenusLogo from './unichainVenusLogo.svg';
import UnichainVenusLogoWithText from './unichainVenusLogoWithText.svg';
import OriginalVenusLogo from './venusLogo.svg';
import OriginalVenusLogoWithText from './venusLogoWithText.svg';

type LogoMapping = {
  [chainId in ChainId]: {
    withoutText: string;
    withText: string;
  };
};

const logoMapping = Object.values(ChainId)
  .filter((value): value is ChainId => !Number.isNaN(+value))
  .reduce<LogoMapping>((acc, chainId) => {
    const logoSrc = {
      withoutText: '',
      withText: '',
    };

    switch (chainId) {
      case ChainId.UNICHAIN_MAINNET:
      case ChainId.UNICHAIN_SEPOLIA:
        logoSrc.withoutText = UnichainVenusLogo;
        logoSrc.withText = UnichainVenusLogoWithText;
        break;
      case ChainId.BERACHAIN_MAINNET:
      case ChainId.BERACHAIN_TESTNET:
        logoSrc.withoutText = BerachainVenusLogo;
        logoSrc.withText = BerachainVenusLogoWithText;
        break;
      default:
        logoSrc.withoutText = OriginalVenusLogo;
        logoSrc.withText = OriginalVenusLogoWithText;
        break;
    }

    return {
      ...acc,
      [chainId]: logoSrc,
    };
  }, {} as LogoMapping);

export interface VenusLogoProps extends Omit<React.HTMLAttributes<HTMLImageElement>, 'src'> {
  chainId?: ChainId;
  alt?: string;
  withText?: boolean;
}

export const VenusLogo: React.FC<VenusLogoProps> = ({
  alt,
  withText = false,
  chainId = ChainId.BSC_MAINNET,
  ...otherProps
}) => {
  const logoImgs = logoMapping[chainId || ChainId.BSC_MAINNET];

  return (
    <img
      src={withText ? logoImgs.withText : logoImgs.withoutText}
      {...otherProps}
      alt={alt || 'Venus logo'}
    />
  );
};
