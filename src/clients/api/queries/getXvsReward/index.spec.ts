import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import { VTokenId } from 'types';
import fakeAddress from '__mocks__/models/address';
import { Comptroller } from 'types/contracts';
import getVTokenData from './getVTokenData';
import getXvsReward from '.';

jest.mock('./getVTokenData');

describe('api/queries/getXvsReward', () => {
  test('throws an error when one of getVTokenData calls fails', async () => {
    (getVTokenData as jest.Mock).mockImplementationOnce(async () => {
      throw new Error('Fake error message');
    });

    try {
      await getXvsReward({
        comptrollerContract: {} as unknown as Comptroller,
        web3: {} as unknown as Web3,
        accountAddress: fakeAddress,
        venusInitialIndex: '0',
        xvsAccrued: new BigNumber(0),
        vaiMintIndex: '0',
        userVaiMintIndex: '0',
        userMintedVai: new BigNumber(0),
      });

      throw new Error('getXvsReward should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns correct XVS reward amount in wei', async () => {
    (getVTokenData as jest.Mock).mockImplementation(
      // Note: we're only interested in returning fake data based on tokenId, so
      // we ignore other parameters passed to the function
      async ({ tokenId }: { tokenId: VTokenId }) => {
        switch (tokenId) {
          case 'sxp':
            return {
              borrowStateIndex: '2513615399460371605608397843414348404519910359179',
              supplyStateIndex: '18116117080571488716532168557866470495186628',
              tokenBorrowIndex: '1088298121330057294',
              userBalanceWei: new BigNumber('39659382237129'),
              userBorrowBalanceStoredWei: new BigNumber('74098549634669940'),
              userBorrowIndex: '2513615399212687697932848737906903229144700235483',
              userSupplyIndex: '18116117080571447340173757134183877391544685',
            };
          case 'trx':
            return {
              borrowStateIndex: '3131926084642327884245032373361300281952440012851',
              supplyStateIndex: '50767324415277671715702397438010594728696008',
              tokenBorrowIndex: '1034271518677639229',
              userBalanceWei: new BigNumber('44826094669814'),
              userBorrowBalanceStoredWei: new BigNumber('118502385376330367869'),
              userBorrowIndex: '3131283012615727995091912470112763222989941771982',
              userSupplyIndex: '50767324415277671715314362373834548415915962',
            };
          default:
            return {
              borrowStateIndex: '2209633940829243128965823310962584504',
              supplyStateIndex: '91862240929853739923504250895875542374759719',
              tokenBorrowIndex: '1076959142829628775',
              userBalanceWei: new BigNumber('571741541724833'),
              userBorrowBalanceStoredWei: new BigNumber('0'),
              userBorrowIndex: '2209529434601399669908831187868091047',
              userSupplyIndex: '91856416775652765085240704175165991435424755',
            };
        }
      },
    );

    const res = await getXvsReward({
      comptrollerContract: {} as unknown as Comptroller,
      web3: {} as unknown as Web3,
      accountAddress: fakeAddress,
      venusInitialIndex: '1000000000000000000000000000000000000',
      xvsAccrued: new BigNumber(0),
      vaiMintIndex: '1235570923392602317081285608441920863',
      userVaiMintIndex: '1234097255434816053226745973593453893',
      userMintedVai: new BigNumber('6774861994741465595631650'),
    });

    expect(res instanceof BigNumber).toBe(true);
    expect(res.toFixed()).toBe('73680438982174403880000000000');
  });
});
