import { Contract, ContractInterface, Signer } from 'ethers';
import { ContractTypeByName, contractInfos } from 'packages/contracts';
import { Token, VToken } from 'types';
import { areTokensEqual, getContractAddress } from 'utilities';

import { chain, provider } from 'clients/web3';
import { TOKENS } from 'constants/tokens';

import { TokenContract, VTokenContract } from './types';

export const getContract = ({
  abi,
  address,
  signer,
}: {
  abi: ContractInterface;
  address: string;
  signer?: Signer;
}) => {
  const signerOrProvider = signer ?? provider({ chainId: chain.id });
  return new Contract(address, abi, signerOrProvider);
};

export const getTokenContract = (token: Token, signer?: Signer) => {
  if (areTokensEqual(token, TOKENS.xvs)) {
    return getContract({
      abi: contractInfos.xvs.abi,
      address: token.address,
      signer,
    }) as TokenContract<'xvs'>;
  }

  if (areTokensEqual(token, TOKENS.vai)) {
    return getContract({
      abi: contractInfos.vai.abi,
      address: token.address,
      signer,
    }) as TokenContract<'vai'>;
  }

  if (areTokensEqual(token, TOKENS.vrt)) {
    return getContract({
      abi: contractInfos.vrt.abi,
      address: token.address,
      signer,
    }) as TokenContract<'vrt'>;
  }

  return getContract({
    abi: contractInfos.bep20.abi,
    address: token.address,
    signer,
  }) as ContractTypeByName<'bep20'>;
};

export const getVTokenContract = (vToken: VToken, signer?: Signer) => {
  if (vToken.symbol === 'vBNB') {
    return getContract({
      abi: contractInfos.vBnb.abi,
      address: vToken.address,
      signer,
    }) as VTokenContract<'bnb'>;
  }

  return getContract({
    abi: contractInfos.vToken.abi,
    address: vToken.address,
    signer,
  }) as VTokenContract;
};

<<<<<<< HEAD
=======
export const getVaiVaultContract = (signer?: Signer) =>
  getContract({
    abi: contractInfos.vaiVault.abi,
    address: getContractAddress('vaiVault'),
    signer,
  }) as ContractTypeByName<'vaiVault'>;

export const getXvsVaultProxyContract = (signer?: Signer) =>
  getContract({
    abi: contractInfos.xvsVault.abi,
    address: getContractAddress('xvsVaultProxy'),
    signer,
  }) as ContractTypeByName<'xvsVault'>;

export const getXvsVaultStoreContract = (signer?: Signer) =>
  getContract({
    abi: contractInfos.xvsStore.abi,
    address: getContractAddress('xvsVaultStore'),
    signer,
  }) as ContractTypeByName<'xvsStore'>;

export const getComptrollerContract = (address: string, signer?: Signer) =>
  getContract({
    abi: contractInfos.mainPoolComptroller.abi,
    address,
    signer,
  }) as ContractTypeByName<'mainPoolComptroller'>;

export const getGovernorBravoDelegateContract = (signer?: Signer) =>
  getContract({
    abi: contractInfos.governorBravoDelegate.abi,
    address: getContractAddress('governorBravoDelegate'),
    signer,
  }) as ContractTypeByName<'governorBravoDelegate'>;

>>>>>>> bc4f3dc0d (refactor: remove ABIs in constants in favor of using contracts package)
export const getMaximillionContract = (signer?: Signer) =>
  getContract({
    abi: contractInfos.maximillion.abi,
    address: getContractAddress('maximillion'),
    signer,
  }) as ContractTypeByName<'maximillion'>;
<<<<<<< HEAD
=======

export const getVrtConverterProxyContract = (signer?: Signer) =>
  getContract({
    abi: contractInfos.vrtConverter.abi,
    address: getContractAddress('vrtConverterProxy'),
    signer,
  }) as ContractTypeByName<'vrtConverter'>;

// Swap router
export const getSwapRouterContract = (poolComptrollerAddress: string, signer?: Signer) => {
  const swapRouterAddress = getSwapRouterContractAddress(poolComptrollerAddress);

  return getContract({
    abi: contractInfos.swapRouter.abi,
    address: swapRouterAddress,
    signer,
  }) as ContractTypeByName<'swapRouter'>;
};

export const getPoolLensContract = (signer?: Signer) =>
  getContract({
    abi: contractInfos.poolLens.abi,
    address: getContractAddress('PoolLens'),
    signer,
  }) as ContractTypeByName<'poolLens'>;
>>>>>>> d56f71952 (refactor: remove unused ABIs + add contracts)
