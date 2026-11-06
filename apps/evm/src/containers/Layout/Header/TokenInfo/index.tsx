import type BigNumber from 'bignumber.js';

import {
  CellGroup,
  type CellProps,
  Icon,
  ProtectionModeIndicator,
  Spinner,
  TokenIcon,
  Wrapper,
} from 'components';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import { useAccountAddress, useChainId } from 'libs/wallet';
import type { Token, VToken, VhToken } from 'types';
import { generateExplorerUrl } from 'utilities';
import type { Address } from 'viem';
import { AddTokenToWalletDropdown } from './AddTokenToWalletDropdown';
import { GoToTokenContractDropdown } from './GoToTokenContractDropdown';

export interface TokenInfoProps {
  token?: Token;
  tokenPriceOracleAddress?: Address;
  relatedTokens?: Array<Token | VToken | VhToken>;
  protectionModeIndicator?: {
    tokenSupplyPriceCents: BigNumber;
    tokenBorrowPriceCents: BigNumber;
  };
  cells: CellProps[];
}

export const TokenInfo: React.FC<TokenInfoProps> = ({
  cells,
  token,
  relatedTokens = [],
  protectionModeIndicator,
  tokenPriceOracleAddress,
}) => {
  const { t } = useTranslation();

  const { chainId } = useChainId();

  const { accountAddress } = useAccountAddress();
  const isUserConnected = !!accountAddress;

  const oracleContractHref =
    tokenPriceOracleAddress &&
    generateExplorerUrl({
      hash: tokenPriceOracleAddress,
      chainId,
    });

  return (
    <div className="pb-6 md:pb-8">
      <Wrapper className="space-y-4 sm:space-y-6">
        <div className="flex items-center min-h-8">
          {token ? (
            <div className="flex flex-col gap-y-3 sm:items-center sm:flex-row sm:justify-between sm:w-full md:w-auto md:gap-x-3">
              <div className="flex items-center gap-3">
                <TokenIcon token={token} className="size-10 shrink-0" />

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-bold text-lg">{token.symbol}</span>
                </div>

                <AddTokenToWalletDropdown
                  isUserConnected={isUserConnected}
                  tokens={relatedTokens}
                />

                <GoToTokenContractDropdown tokens={relatedTokens} />
              </div>

              {oracleContractHref && (
                <Link
                  noStyle
                  href={oracleContractHref}
                  aria-label={t('layout.header.resilientOracle')}
                  className="inline-flex h-8 shrink-0 items-center justify-center gap-x-2 self-start rounded-lg bg-surface-raised text-sm font-semibold text-light-grey shadow-raised backdrop-blur-raised transition-colors duration-150 hover:text-white max-sm:w-8 sm:px-4"
                >
                  <span className="max-sm:hidden">{t('layout.header.resilientOracle')}</span>

                  <Icon name="resilientOracle" className="h-5 w-5 text-inherit" />
                </Link>
              )}

              {protectionModeIndicator && (
                <ProtectionModeIndicator
                  variant="label"
                  tokenName={token.symbol}
                  tokenSupplyPriceCents={protectionModeIndicator.tokenSupplyPriceCents}
                  tokenBorrowPriceCents={protectionModeIndicator.tokenBorrowPriceCents}
                />
              )}
            </div>
          ) : (
            <Spinner className="h-full w-auto" />
          )}
        </div>

        <CellGroup
          cells={cells.map(cell => ({
            ...cell,
            className: 'p-0 bg-transparent',
          }))}
          grid
          className="md:gap-x-15 xl:p-0 xl:bg-transparent"
        />
      </Wrapper>
    </div>
  );
};
