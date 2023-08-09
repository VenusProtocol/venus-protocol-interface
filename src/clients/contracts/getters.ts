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

export const getMaximillionContract = (signer?: Signer) =>
  getContract({
    abi: contractInfos.maximillion.abi,
    address: getContractAddress('maximillion'),
    signer,
  }) as ContractTypeByName<'maximillion'>;
