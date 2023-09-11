import { ContractCallResults } from 'ethereum-multicall';
import { contractInfos } from 'packages/contracts';

const interestRateModel: {
  [key: string]: ContractCallResults;
} = {
  getVTokenBalances: {
    results: {
      getVTokenRates: {
        originalContractCallContext: {
          reference: 'getVTokenRates',
          contractAddress: '0xa166Ca91a570747708a318A771F0C9AB84DD984b',
          abi: contractInfos.jumpRateModel.abi,
          calls: [
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['990000', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['990000', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['490000', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['490000', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['323333', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['323333', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['240000', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['240000', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['190000', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['190000', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['156667', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['156667', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['132857', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['132857', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['115000', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['115000', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['101111', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['101111', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['90000', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['90000', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['80909', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['80909', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['73333', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['73333', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['66923', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['66923', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['61429', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['61429', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['56667', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['56667', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['52500', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['52500', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['48824', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['48824', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['45556', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['45556', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['42632', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['42632', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['40000', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['40000', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['37619', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['37619', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['35455', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['35455', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['33478', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['33478', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['31667', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['31667', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['30000', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['30000', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['28462', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['28462', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['27037', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['27037', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['25714', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['25714', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['24483', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['24483', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['23333', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['23333', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['22258', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['22258', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['21250', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['21250', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['20303', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['20303', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['19412', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['19412', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['18571', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['18571', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['17778', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['17778', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['17027', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['17027', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['16316', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['16316', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['15641', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['15641', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['15000', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['15000', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['14390', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['14390', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['13810', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['13810', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['13256', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['13256', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['12727', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['12727', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['12222', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['12222', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['11739', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['11739', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['11277', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['11277', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['10833', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['10833', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['10408', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['10408', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['10000', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['10000', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['9608', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['9608', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['9231', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['9231', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['8868', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['8868', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['8519', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['8519', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['8182', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['8182', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['7857', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['7857', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['7544', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['7544', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['7241', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['7241', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['6949', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['6949', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['6667', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['6667', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['6393', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['6393', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['6129', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['6129', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['5873', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['5873', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['5625', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['5625', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['5385', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['5385', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['5152', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['5152', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['4925', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['4925', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['4706', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['4706', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['4493', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['4493', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['4286', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['4286', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['4085', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['4085', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['3889', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['3889', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['3699', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['3699', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['3514', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['3514', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['3333', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['3333', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['3158', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['3158', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['2987', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['2987', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['2821', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['2821', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['2658', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['2658', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['2500', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['2500', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['2346', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['2346', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['2195', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['2195', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['2048', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['2048', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['1905', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['1905', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['1765', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['1765', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['1628', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['1628', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['1494', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['1494', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['1364', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['1364', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['1236', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['1236', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['1111', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['1111', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['989', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['989', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['870', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['870', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['753', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['753', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['638', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['638', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['526', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['526', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['417', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['417', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['309', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['309', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['204', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['204', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['101', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['101', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['0', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['0', '10000', '0', '250000000000000000'],
            },
          ],
        },
        callsReturnContext: [
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x88156afe',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['990000', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x010547d7',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['990000', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x01102ad5fd',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['490000', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x04151f5e',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['490000', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0198405bbd',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['323333', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x092f87c9',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['323333', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x022055abfb',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['240000', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x10547d7a',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['240000', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x02a86b16fa',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['190000', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1984040f',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['190000', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x03308016f3',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['156667', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x24be10b2',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['156667', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x03b8962b65',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['132857', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x3202c6d5',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['132857', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0440ab57f6',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['115000', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x4151f5ea',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['115000', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x04c8c11339',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['101111', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x52abc613',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['101111', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0550d62df4',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['90000', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x6610103f',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['90000', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x05d8ebfb0d',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['80909', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x7b7f051f',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['80909', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x066102b007',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['73333', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x92f8b65e',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['73333', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x06e916e2e1',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['66923', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0xac7c83fc',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['66923', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x077128eccb',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['61429', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0xc80a63cd',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['61429', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x07f93ea80e',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['56667', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0xe5a38e0e',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['56667', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x088156afed',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['52500', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x010547d7ab',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['52500', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0909675e08',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['48824', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0126f4e52f',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['48824', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x09917c81ae',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['45556', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x014aad9237',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['45556', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0a1991a554',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['42632', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x017070ccca',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['42632', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0aa1ac5be8',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['40000', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x01984040fc',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['40000', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0b29c28230',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['37619', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x01c218fd85',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['37619', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0bb1cf87e0',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['35455', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x01edf94c49',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['35455', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0c39f16ba3',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['33478', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x021beb1d45',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['33478', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0cc1fb5793',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['31667', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x024bdf3cd4',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['31667', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0d4a1772e2',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['30000', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x027de4658a',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['30000', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0dd221ff61',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['28462', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x02b1ed7856',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['28462', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0e5a4339ac',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['27037', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x02e809f6ae',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['27037', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0ee25f819a',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['25714', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x03202f4b8b',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['25714', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0f6a660c72',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['24483', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x035a55effb',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['24483', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0ff28cfd67',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['23333', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0396954637',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['23333', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x107a9a1dcc',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['22258', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x03d4d3b1ba',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['22258', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1102ad5fda',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['21250', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x04151f5eaf',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['21250', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x118ac3f127',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['20303', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0457772e20',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['20303', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1212cebc10',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['19412', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x049bd394bf',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['19412', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x129affeb0f',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['18571', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x04e24e6134',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['18571', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1322f9035c',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['17778', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x052ab648dd',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['17778', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x13ab19c0cf',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['17027', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x05753de779',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['17027', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1433234aa9',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['16316', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x05c1c33329',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['16316', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x14bb44a8a3',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['15641', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x061060a3dc',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['15641', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x154358b7d1',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['15000', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x06610103f1',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['15000', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x15cb7c6b62',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['14390', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x06b3b587fc',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['14390', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1653664a84',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['13810', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0708509aa4',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['13810', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x16db8cfce7',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['13256', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x075f1c29ee',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['13256', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1763c0c8c2',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['12727', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x07b7fb72f1',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['12727', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x17ebd37c1a',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['12222', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0812cfddfd',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['12222', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1873e2d746',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['11739', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x086fac7516',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['11739', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x18fbcf88d2',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['11277', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x08ce7afd77',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['11277', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x19841ed134',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['10833', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x092f99d8aa',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['10833', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1a0c2722ce',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['10408', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x099290d75a',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['10408', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1a942ee5c5',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['10000', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x09f7919629',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['10000', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1b1c361a18',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['9608', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0a5e9c0eae',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['9608', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1ba443fec2',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['9231', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0ac7b5e159',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['9231', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1c2c67c411',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['8868', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0b32eb6e63',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['8868', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1cb453a8ac',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['8519', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0b9ffeb6af',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['8519', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1d3c86d3b0',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['8182', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0c0f561ccd',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['8182', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1dc4bf0335',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['7857', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0c80bd2e2c',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['7857', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1e4cb4effd',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['7544', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0cf3f7331c',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['7544', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1ed506b1d6',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['7241', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0d698abad9',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['7241', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1f5d02286e',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['6949', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0de0de42bc',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['6949', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1fe4db45e2',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['6667', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0e5a1ca950',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['6667', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x206d53dfb0',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['6393', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0ed5f5be66',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['6393', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x20f5343b99',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['6129', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0f534ec6e8',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['6129', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x217d478692',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['5873', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0fd2e0e9b3',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['5873', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x22055abfb5',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['5625', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x10547d7abc',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['5625', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x228d378eb3',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['5385', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x10d7ef7ce3',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['5385', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x23153c02af',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['5152', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x115d919b6a',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['5152', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x239dd55b5a',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['4925', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x11e5d36a5d',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['4925', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x24259d7821',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['4706', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x126f4e52fc',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['4706', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x24ad9cf99a',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['4493', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x12fb0aced9',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['4493', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2535aa7c32',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['4286', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1388dfe674',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['4286', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x25bd9a1b47',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['4085', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x14189f7c64',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['4085', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2645f206b9',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['3889', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x14aad92375',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['3889', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x26cdd6d904',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['3699', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x153ea1513b',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['3699', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2755d41ff4',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['3514', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x15d48dbec2',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['3514', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x27de87ab09',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['3333', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x166d510ec7',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['3333', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2866469552',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['3158', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x17070ccca5',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['3158', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x28ee73dd5d',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['2987', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x17a34ffb22',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['2987', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x29761f5892',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['2821', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1841069374',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['2821', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x29fecd8ecd',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['2658', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x18e1f72552',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['2658', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2a86b16fa2',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['2500', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1984040fc7',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['2500', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2b0e7d7d03',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['2346', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1a27fd1b0c',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['2346', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2b96f8d6c4',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['2195', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1aced61ff3',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['2195', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2c1f1ff46a',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['2048', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1b7753e463',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['2048', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2ca6cc9509',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['1905', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1c21426a93',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['1905', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2d2ed27f87',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['1765', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1ccdaa337c',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['1765', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2db719f9cf',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['1628', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1d7c70a7ba',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['1628', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2e3f8a0ac1',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['1494', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1e2d78246a',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['1494', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2ec6faae3f',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['1364', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1edf3bbef5',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['1364', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2f4f65cba9',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['1236', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1f945359a4',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['1236', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2fd7a6f835',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['1111', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x204b3f77f5',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['1111', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x305fa03428',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['989', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2103d54341',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['989', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x30e7324141',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['870', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x21bde6623e',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['870', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x316f69ea67',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['753', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x227ae52531',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['753', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x31f838fb66',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['638', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x233ac4fa96',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['638', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x328055feb5',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['526', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x23fbb737a5',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['526', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x33079d1b2d',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['417', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x24bd8039ff',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['417', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x339078c86c',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['309', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x25839a3fe9',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['309', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x34184e459d',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['204', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x264a435d69',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['204', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x34a04bd377',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['101', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2713309f24',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['101', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x35285dcb8b',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['0', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x27de4658a8',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['0', '10000', '0', '250000000000000000'],
            success: true,
          },
        ],
      },
    },
    blockNumber: 23050934,
  },
};

export const lenses: {
  [key: string]: ContractCallResults;
} = {
  getPendingRewardGroups: {
    results: {
      venusLens: {
        originalContractCallContext: {
          reference: 'venusLens',
          contractAddress: '0x11c8dC3DcA87E8205ec01e6d79Be9442d31701d3',
          abi: contractInfos.venusLens.abi,
          calls: [
            {
              reference: 'pendingRewards',
              methodName: 'pendingRewards',
              methodParameters: [
                '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
                '0x94d1820b2D1c7c7452A163983Dc888CEC546b77D',
              ],
            },
          ],
        },
        callsReturnContext: [
          {
            returnValues: [
              '0x94d1820b2D1c7c7452A163983Dc888CEC546b77D',
              '0xB9e0E753630434d7863528cc73CB7AC638a7c8ff',
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              [
                [
                  '0xD5C4C2e2facBEB59D0216D0595d63FcDc6F9A1a7',
                  {
                    type: 'BigNumber',
                    hex: '0x020652d584',
                  },
                ],
                [
                  '0xb7526572FFE56AB9D7489838Bf2E18e3323b441A',
                  {
                    type: 'BigNumber',
                    hex: '0x0169ddac27be9fb9290c',
                  },
                ],
                [
                  '0x08e0A5575De71037aE36AbfAfb516595fE68e5e4',
                  {
                    type: 'BigNumber',
                    hex: '0x05bfa6c887f58ecb',
                  },
                ],
                [
                  '0x74469281310195A04840Daf6EdF576F559a3dE80',
                  {
                    type: 'BigNumber',
                    hex: '0x0a3d108c76',
                  },
                ],
                [
                  '0x2E7222e51c0f6e98610A1543Aa3836E092CDe62c',
                  {
                    type: 'BigNumber',
                    hex: '0x04e5602f1da7599ad3c1',
                  },
                ],
                [
                  '0x6d6F697e34145Bb95c54E77482d97cc261Dc237E',
                  {
                    type: 'BigNumber',
                    hex: '0x00',
                  },
                ],
                [
                  '0x162D005F0Fff510E54958Cfc5CF32A3180A84aab',
                  {
                    type: 'BigNumber',
                    hex: '0x63f8fe9c05c99b09',
                  },
                ],
                [
                  '0xAfc13BC065ABeE838540823431055D2ea52eBA52',
                  {
                    type: 'BigNumber',
                    hex: '0x46d5c92dc1efb7d6f0',
                  },
                ],
                [
                  '0x488aB2826a154da01CC4CC16A8C83d4720D3cA2C',
                  {
                    type: 'BigNumber',
                    hex: '0x9cff170aea1025e600',
                  },
                ],
                [
                  '0xb6e9322C49FD75a367Fcb17B0Fcd62C5070EbCBe',
                  {
                    type: 'BigNumber',
                    hex: '0x3ea34275cf2676e924',
                  },
                ],
                [
                  '0x37C28DE42bA3d22217995D146FC684B2326Ede64',
                  {
                    type: 'BigNumber',
                    hex: '0x2bf1200ff4d1c0506b',
                  },
                ],
                [
                  '0xF912d3001CAf6DC4ADD366A62Cc9115B4303c9A9',
                  {
                    type: 'BigNumber',
                    hex: '0x66dee05befae8c13',
                  },
                ],
                [
                  '0xeDaC03D29ff74b5fDc0CC936F6288312e1459BC6',
                  {
                    type: 'BigNumber',
                    hex: '0x2b6890bf27d3bb2032',
                  },
                ],
                [
                  '0x3619bdDc61189F33365CC572DF3a68FB3b316516',
                  {
                    type: 'BigNumber',
                    hex: '0x00',
                  },
                ],
                [
                  '0x714db6c38A17883964B68a07d56cE331501d9eb6',
                  {
                    type: 'BigNumber',
                    hex: '0x66fdfb8575',
                  },
                ],
                [
                  '0x3A00d9B02781f47d033BAd62edc55fBF8D083Fb0',
                  {
                    type: 'BigNumber',
                    hex: '0x00',
                  },
                ],
                [
                  '0x369Fea97f6fB7510755DCA389088d9E2e2819278',
                  {
                    type: 'BigNumber',
                    hex: '0x00',
                  },
                ],
                [
                  '0xF206af85BC2761c4F876d27Bd474681CfB335EfA',
                  {
                    type: 'BigNumber',
                    hex: '0x00',
                  },
                ],
                [
                  '0x9C3015191d39cF1930F92EB7e7BCbd020bCA286a',
                  {
                    type: 'BigNumber',
                    hex: '0x00',
                  },
                ],
                [
                  '0x6AF3Fdb3282c5bb6926269Db10837fa8Aec67C04',
                  {
                    type: 'BigNumber',
                    hex: '0x14444458fa73d090bd',
                  },
                ],
              ],
            ],
            decoded: true,
            reference: 'pendingRewards',
            methodName: 'pendingRewards',
            methodParameters: [
              '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
              '0x94d1820b2D1c7c7452A163983Dc888CEC546b77D',
            ],
            success: true,
          },
        ],
      },
      vaiVault: {
        originalContractCallContext: {
          reference: 'vaiVault',
          contractAddress: '0x7Db4f5cC3bBA3e12FF1F528D2e3417afb0a57118',
          abi: contractInfos.vaiVault.abi,
          calls: [
            {
              reference: 'pendingXVS',
              methodName: 'pendingXVS',
              methodParameters: ['0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706'],
            },
          ],
        },
        callsReturnContext: [
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x00',
              },
            ],
            decoded: true,
            reference: 'pendingXVS',
            methodName: 'pendingXVS',
            methodParameters: ['0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706'],
            success: true,
          },
        ],
      },
      xvsVestingVaults: {
        originalContractCallContext: {
          reference: 'xvsVestingVaults',
          contractAddress: '0x9aB56bAD2D7631B2A857ccf36d998232A8b82280',
          abi: contractInfos.xvsVault.abi,
          calls: [
            {
              reference: 'vault-0-poolInfos',
              methodName: 'poolInfos',
              methodParameters: ['0xB9e0E753630434d7863528cc73CB7AC638a7c8ff', 0],
            },
            {
              reference: 'vault-0-pendingReward',
              methodName: 'pendingReward',
              methodParameters: [
                '0xB9e0E753630434d7863528cc73CB7AC638a7c8ff',
                0,
                '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
              ],
            },
            {
              reference: 'vault-0-pendingWithdrawalsBeforeUpgrade',
              methodName: 'pendingWithdrawalsBeforeUpgrade',
              methodParameters: [
                '0xB9e0E753630434d7863528cc73CB7AC638a7c8ff',
                0,
                '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
              ],
            },
            {
              reference: 'vault-1-poolInfos',
              methodName: 'poolInfos',
              methodParameters: ['0xB9e0E753630434d7863528cc73CB7AC638a7c8ff', 1],
            },
            {
              reference: 'vault-1-pendingReward',
              methodName: 'pendingReward',
              methodParameters: [
                '0xB9e0E753630434d7863528cc73CB7AC638a7c8ff',
                1,
                '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
              ],
            },
            {
              reference: 'vault-1-pendingWithdrawalsBeforeUpgrade',
              methodName: 'pendingWithdrawalsBeforeUpgrade',
              methodParameters: [
                '0xB9e0E753630434d7863528cc73CB7AC638a7c8ff',
                1,
                '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
              ],
            },
          ],
        },
        callsReturnContext: [
          {
            returnValues: [
              '0x5fFbE5302BadED40941A403228E6AD03f93752d9',
              {
                type: 'BigNumber',
                hex: '0x64',
              },
              {
                type: 'BigNumber',
                hex: '0x01771a90',
              },
              {
                type: 'BigNumber',
                hex: '0x3f2267927005',
              },
              {
                type: 'BigNumber',
                hex: '0x012c',
              },
            ],
            decoded: true,
            reference: 'vault-0-poolInfos',
            methodName: 'poolInfos',
            methodParameters: ['0xB9e0E753630434d7863528cc73CB7AC638a7c8ff', 0],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x039e30d2c16983b55100',
              },
            ],
            decoded: true,
            reference: 'vault-0-pendingReward',
            methodName: 'pendingReward',
            methodParameters: [
              '0xB9e0E753630434d7863528cc73CB7AC638a7c8ff',
              0,
              '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
            ],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x3635c9adc5dea00000',
              },
            ],
            decoded: true,
            reference: 'vault-0-pendingWithdrawalsBeforeUpgrade',
            methodName: 'pendingWithdrawalsBeforeUpgrade',
            methodParameters: [
              '0xB9e0E753630434d7863528cc73CB7AC638a7c8ff',
              0,
              '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
            ],
            success: true,
          },
          {
            returnValues: [
              '0xB9e0E753630434d7863528cc73CB7AC638a7c8ff',
              {
                type: 'BigNumber',
                hex: '0x64',
              },
              {
                type: 'BigNumber',
                hex: '0x01a8c566',
              },
              {
                type: 'BigNumber',
                hex: '0xa93798a311',
              },
              {
                type: 'BigNumber',
                hex: '0x012c',
              },
            ],
            decoded: true,
            reference: 'vault-1-poolInfos',
            methodName: 'poolInfos',
            methodParameters: ['0xB9e0E753630434d7863528cc73CB7AC638a7c8ff', 1],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x7f371dc7ec6b78f840',
              },
            ],
            decoded: true,
            reference: 'vault-1-pendingReward',
            methodName: 'pendingReward',
            methodParameters: [
              '0xB9e0E753630434d7863528cc73CB7AC638a7c8ff',
              1,
              '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
            ],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x3635c9adc5dea00000',
              },
            ],
            decoded: true,
            reference: 'vault-1-pendingWithdrawalsBeforeUpgrade',
            methodName: 'pendingWithdrawalsBeforeUpgrade',
            methodParameters: [
              '0xB9e0E753630434d7863528cc73CB7AC638a7c8ff',
              1,
              '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
            ],
            success: true,
          },
        ],
      },
      poolLens: {
        originalContractCallContext: {
          reference: 'poolLens',
          contractAddress: '0x90fAa4B139bb5Cba016d9d1D343981541A0C5251',
          abi: contractInfos.poolLens.abi,
          calls: [
            {
              reference: 'getPendingRewards',
              methodName: 'getPendingRewards',
              methodParameters: [
                '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
                '0x2f83bc52a10546ec3a2cabbb706c82b869d2d677',
              ],
            },
            {
              reference: 'getPendingRewards',
              methodName: 'getPendingRewards',
              methodParameters: [
                '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
                '0x6ced7215ebf7b421ebda06feb64f1fd24118b0c9',
              ],
            },
          ],
        },
        callsReturnContext: [
          {
            returnValues: [
              [
                '0xb26C2976e0689eE710f12ddf15bcd26e9010D87F',
                '0xB9e0E753630434d7863528cc73CB7AC638a7c8ff',
                {
                  type: 'BigNumber',
                  hex: '0x00',
                },
                [
                  [
                    '0x37A0aC901578a7F05379Fc43330B3D1e39D0C40c',
                    {
                      type: 'BigNumber',
                      hex: '0x00',
                    },
                  ],
                  [
                    '0x75a10f0C415DCcCa275e8CdD8447D291a6b86f06',
                    {
                      type: 'BigNumber',
                      hex: '0x00',
                    },
                  ],
                ],
              ],
              [
                '0x89ab98Dc3072992CC78257CfA0900e4394Ce0350',
                '0xca83b44F7EEa4ca927b6cE41A48f119458acde4C',
                {
                  type: 'BigNumber',
                  hex: '0x00',
                },
                [
                  [
                    '0x37A0aC901578a7F05379Fc43330B3D1e39D0C40c',
                    {
                      type: 'BigNumber',
                      hex: '0x00',
                    },
                  ],
                  [
                    '0x75a10f0C415DCcCa275e8CdD8447D291a6b86f06',
                    {
                      type: 'BigNumber',
                      hex: '0x00',
                    },
                  ],
                ],
              ],
            ],
            decoded: true,
            reference: 'getPendingRewards',
            methodName: 'getPendingRewards',
            methodParameters: [
              '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
              '0x2f83bc52a10546ec3a2cabbb706c82b869d2d677',
            ],
            success: true,
          },
          {
            returnValues: [
              [
                '0xBfabfDC3A90C5a091DDA7721133E87871dd25d5F',
                '0xB9e0E753630434d7863528cc73CB7AC638a7c8ff',
                {
                  type: 'BigNumber',
                  hex: '0x1b1086bbcb85623f405c',
                },
                [
                  [
                    '0xcfC8A73F9c888EeA9AF9ccCa24646e84A915510B',
                    {
                      type: 'BigNumber',
                      hex: '0x00',
                    },
                  ],
                  [
                    '0x12d3a3Aa7f4917Ea3b8eE34F99A9A7Eec521FA61',
                    {
                      type: 'BigNumber',
                      hex: '0x239b98b3c730ab921742',
                    },
                  ],
                ],
              ],
              [
                '0x774fe56781613eDB1bFaFB1C53fbd1831C0234BD',
                '0x98f7A83361F7Ac8765CcEBAB1425da6b341958a7',
                {
                  type: 'BigNumber',
                  hex: '0x00',
                },
                [
                  [
                    '0xcfC8A73F9c888EeA9AF9ccCa24646e84A915510B',
                    {
                      type: 'BigNumber',
                      hex: '0x00',
                    },
                  ],
                  [
                    '0x12d3a3Aa7f4917Ea3b8eE34F99A9A7Eec521FA61',
                    {
                      type: 'BigNumber',
                      hex: '0x00',
                    },
                  ],
                ],
              ],
            ],
            decoded: true,
            reference: 'getPendingRewards',
            methodName: 'getPendingRewards',
            methodParameters: [
              '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
              '0x6ced7215ebf7b421ebda06feb64f1fd24118b0c9',
            ],
            success: true,
          },
        ],
      },
    },
    blockNumber: 28241755,
  },
};

const vaiController: {
  [key: string]: ContractCallResults;
} = {
  getVaiRepayTotalAmount: {
    results: {
      getVaiRepayTotalAmount: {
        originalContractCallContext: {
          reference: 'getVaiRepayTotalAmount',
          contractAddress: '0xf70C3C6b749BbAb89C081737334E74C9aFD4BE16',
          abi: [],
          calls: [
            {
              reference: 'accrueVAIInterest',
              methodName: 'accrueVAIInterest',
              methodParameters: [],
            },
            {
              reference: 'getVAIRepayAmount',
              methodName: 'getVAIRepayAmount',
              methodParameters: ['0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706'],
            },
          ],
        },
        callsReturnContext: [
          {
            returnValues: ['0x'],
            decoded: false,
            reference: 'accrueVAIInterest',
            methodName: 'accrueVAIInterest',
            methodParameters: [],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x04b093ee60809ce69523a2',
              },
            ],
            decoded: true,
            reference: 'getVAIRepayAmount',
            methodName: 'getVAIRepayAmount',
            methodParameters: ['0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706'],
            success: true,
          },
        ],
      },
    },
    blockNumber: 26714340,
  },
  getVaiRepayInterests: {
    results: {
      getVaiRepayInterests: {
        originalContractCallContext: {
          reference: 'getVaiInterests',
          contractAddress: '0xf70C3C6b749BbAb89C081737334E74C9aFD4BE16',
          abi: [
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'error',
                  type: 'uint256',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'info',
                  type: 'uint256',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'detail',
                  type: 'uint256',
                },
              ],
              name: 'Failure',
              type: 'event',
              signature: '0x45b96fe442630264581b197e84bbada861235052c5a1aadfff9ea4e40a969aa0',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'liquidator',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'borrower',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'repayAmount',
                  type: 'uint256',
                },
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'vTokenCollateral',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'seizeTokens',
                  type: 'uint256',
                },
              ],
              name: 'LiquidateVAI',
              type: 'event',
              signature: '0x42d401f96718a0c42e5cea8108973f0022677b7e2e5f4ee19851b2de7a0394e7',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'minter',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'feeAmount',
                  type: 'uint256',
                },
              ],
              name: 'MintFee',
              type: 'event',
              signature: '0xb0715a6d41a37c1b0672c22c09a31a0642c1fb3f9efa2d5fd5c6d2d891ee78c6',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'minter',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'mintVAIAmount',
                  type: 'uint256',
                },
              ],
              name: 'MintVAI',
              type: 'event',
              signature: '0x002e68ab1600fc5e7290e2ceaa79e2f86b4dbaca84a48421e167e0b40409218a',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'oldAccessControlAddress',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'newAccessControlAddress',
                  type: 'address',
                },
              ],
              name: 'NewAccessControl',
              type: 'event',
              signature: '0x0f1eca7612e020f6e4582bcead0573eba4b5f7b56668754c6aed82ef12057dd4',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'contract ComptrollerInterface',
                  name: 'oldComptroller',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'contract ComptrollerInterface',
                  name: 'newComptroller',
                  type: 'address',
                },
              ],
              name: 'NewComptroller',
              type: 'event',
              signature: '0x7ac369dbd14fa5ea3f473ed67cc9d598964a77501540ba6751eb0b3decf5870d',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'oldTreasuryAddress',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'newTreasuryAddress',
                  type: 'address',
                },
              ],
              name: 'NewTreasuryAddress',
              type: 'event',
              signature: '0x8de763046d7b8f08b6c3d03543de1d615309417842bb5d2d62f110f65809ddac',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'oldTreasuryGuardian',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'newTreasuryGuardian',
                  type: 'address',
                },
              ],
              name: 'NewTreasuryGuardian',
              type: 'event',
              signature: '0x29f06ea15931797ebaed313d81d100963dc22cb213cb4ce2737b5a62b1a8b1e8',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'oldTreasuryPercent',
                  type: 'uint256',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'newTreasuryPercent',
                  type: 'uint256',
                },
              ],
              name: 'NewTreasuryPercent',
              type: 'event',
              signature: '0x0893f8f4101baaabbeb513f96761e7a36eb837403c82cc651c292a4abdc94ed7',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'oldBaseRateMantissa',
                  type: 'uint256',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'newBaseRateMantissa',
                  type: 'uint256',
                },
              ],
              name: 'NewVAIBaseRate',
              type: 'event',
              signature: '0xc84c32795e68685ec107b0e94ae126ef464095f342c7e2e0fec06a23d2e8677e',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'oldFloatRateMantissa',
                  type: 'uint256',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'newFlatRateMantissa',
                  type: 'uint256',
                },
              ],
              name: 'NewVAIFloatRate',
              type: 'event',
              signature: '0x546fb35dbbd92233aecc22b5a11a6791e5db7ec14f62e49cbac2a10c0437f561',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'oldMintCap',
                  type: 'uint256',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'newMintCap',
                  type: 'uint256',
                },
              ],
              name: 'NewVAIMintCap',
              type: 'event',
              signature: '0x43862b3eea2df8fce70329f3f84cbcad220f47a73be46c5e00df25165a6e1695',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'oldReceiver',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'newReceiver',
                  type: 'address',
                },
              ],
              name: 'NewVAIReceiver',
              type: 'event',
              signature: '0x4df62dd7d9cc4f480a167c19c616ae5d5bb40db6d0c2bc66dba57068225f00d8',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'payer',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'borrower',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'repayVAIAmount',
                  type: 'uint256',
                },
              ],
              name: 'RepayVAI',
              type: 'event',
              signature: '0x1db858e6f7e1a0d5e92c10c6507d42b3dabfe0a4867fe90c5a14d9963662ef7e',
            },
            {
              constant: true,
              inputs: [],
              name: 'INITIAL_VAI_MINT_INDEX',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x65097954',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'contract VAIUnitroller',
                  name: 'unitroller',
                  type: 'address',
                },
              ],
              name: '_become',
              outputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x1d504dc6',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'contract ComptrollerInterface',
                  name: 'comptroller_',
                  type: 'address',
                },
              ],
              name: '_setComptroller',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x4576b5db',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'address',
                  name: 'newTreasuryGuardian',
                  type: 'address',
                },
                {
                  internalType: 'address',
                  name: 'newTreasuryAddress',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'newTreasuryPercent',
                  type: 'uint256',
                },
              ],
              name: '_setTreasuryData',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0xd24febad',
            },
            {
              constant: true,
              inputs: [],
              name: 'accessControl',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x13007d55',
            },
            {
              constant: false,
              inputs: [],
              name: 'accrueVAIInterest',
              outputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0xb49b1005',
            },
            {
              constant: true,
              inputs: [],
              name: 'admin',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0xf851a440',
            },
            {
              constant: true,
              inputs: [],
              name: 'baseRateMantissa',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x3b72fbef',
            },
            {
              constant: true,
              inputs: [],
              name: 'comptroller',
              outputs: [
                {
                  internalType: 'contract ComptrollerInterface',
                  name: '',
                  type: 'address',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x5fe3b567',
            },
            {
              constant: true,
              inputs: [],
              name: 'floatRateMantissa',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x5ce73240',
            },
            {
              constant: true,
              inputs: [],
              name: 'getBlockNumber',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x42cbb15c',
            },
            {
              constant: true,
              inputs: [],
              name: 'getBlocksPerYear',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x741de148',
            },
            {
              constant: true,
              inputs: [
                {
                  internalType: 'address',
                  name: 'minter',
                  type: 'address',
                },
              ],
              name: 'getMintableVAI',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x3785d1d6',
            },
            {
              constant: true,
              inputs: [],
              name: 'getVAIAddress',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0xcbeb2b28',
            },
            {
              constant: true,
              inputs: [
                {
                  internalType: 'address',
                  name: 'borrower',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'repayAmount',
                  type: 'uint256',
                },
              ],
              name: 'getVAICalculateRepayAmount',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x691e45ac',
            },
            {
              constant: true,
              inputs: [
                {
                  internalType: 'address',
                  name: 'minter',
                  type: 'address',
                },
              ],
              name: 'getVAIMinterInterestIndex',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x234f8977',
            },
            {
              constant: true,
              inputs: [
                {
                  internalType: 'address',
                  name: 'account',
                  type: 'address',
                },
              ],
              name: 'getVAIRepayAmount',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x78c2f922',
            },
            {
              constant: true,
              inputs: [],
              name: 'getVAIRepayRate',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0xb9ee8726',
            },
            {
              constant: true,
              inputs: [],
              name: 'getVAIRepayRatePerBlock',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x75c3de43',
            },
            {
              constant: false,
              inputs: [],
              name: 'initialize',
              outputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x8129fc1c',
            },
            {
              constant: true,
              inputs: [],
              name: 'isVenusVAIInitialized',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x60c954ef',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'address',
                  name: 'borrower',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'repayAmount',
                  type: 'uint256',
                },
                {
                  internalType: 'contract VTokenInterface',
                  name: 'vTokenCollateral',
                  type: 'address',
                },
              ],
              name: 'liquidateVAI',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x11b3d5e7',
            },
            {
              constant: true,
              inputs: [],
              name: 'mintCap',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x76c71ca1',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'uint256',
                  name: 'mintVAIAmount',
                  type: 'uint256',
                },
              ],
              name: 'mintVAI',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x4712ee7d',
            },
            {
              constant: true,
              inputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              name: 'pastVAIInterest',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0xf20fd8f4',
            },
            {
              constant: true,
              inputs: [],
              name: 'pendingAdmin',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x26782247',
            },
            {
              constant: true,
              inputs: [],
              name: 'pendingVAIControllerImplementation',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0xb06bb426',
            },
            {
              constant: true,
              inputs: [],
              name: 'receiver',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0xf7260d3e',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'uint256',
                  name: 'repayVAIAmount',
                  type: 'uint256',
                },
              ],
              name: 'repayVAI',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x6fe74a21',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'address',
                  name: 'newAccessControlAddress',
                  type: 'address',
                },
              ],
              name: 'setAccessControl',
              outputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x19129e5a',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'uint256',
                  name: 'newBaseRateMantissa',
                  type: 'uint256',
                },
              ],
              name: 'setBaseRate',
              outputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x1d08837b',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'uint256',
                  name: 'newFloatRateMantissa',
                  type: 'uint256',
                },
              ],
              name: 'setFloatRate',
              outputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x3b5a0a64',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'uint256',
                  name: '_mintCap',
                  type: 'uint256',
                },
              ],
              name: 'setMintCap',
              outputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x4070a0c9',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'address',
                  name: 'newReceiver',
                  type: 'address',
                },
              ],
              name: 'setReceiver',
              outputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x718da7ee',
            },
            {
              constant: true,
              inputs: [],
              name: 'treasuryAddress',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0xc5f956af',
            },
            {
              constant: true,
              inputs: [],
              name: 'treasuryGuardian',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0xb2eafc39',
            },
            {
              constant: true,
              inputs: [],
              name: 'treasuryPercent',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x04ef9d58',
            },
            {
              constant: true,
              inputs: [],
              name: 'vaiControllerImplementation',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x003b5884',
            },
            {
              constant: true,
              inputs: [],
              name: 'vaiMintIndex',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0xb2b481bc',
            },
            {
              constant: true,
              inputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              name: 'venusVAIMinterIndex',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x24650602',
            },
            {
              constant: true,
              inputs: [],
              name: 'venusVAIState',
              outputs: [
                {
                  internalType: 'uint224',
                  name: 'index',
                  type: 'uint224',
                },
                {
                  internalType: 'uint32',
                  name: 'block',
                  type: 'uint32',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0xe44e6168',
            },
          ],
          calls: [
            {
              reference: 'accrueVAIInterest',
              methodName: 'accrueVAIInterest',
              methodParameters: [],
            },
            {
              reference: 'getVAICalculateRepayAmount',
              methodName: 'getVAICalculateRepayAmount',
              methodParameters: [
                '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
                '100000000000000000000',
              ],
            },
          ],
        },
        callsReturnContext: [
          {
            returnValues: '0x',
            decoded: false,
            reference: 'accrueVAIInterest',
            methodName: 'accrueVAIInterest',
            methodParameters: [],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x056bc63d8c71be92ab',
              },
              {
                type: 'BigNumber',
                hex: '0x0120a0f13d2d68',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
            ],
            decoded: true,
            reference: 'getVAICalculateRepayAmount',
            methodName: 'getVAICalculateRepayAmount',
            methodParameters: [
              '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
              '100000000000000000000',
            ],
            success: true,
          },
        ],
      },
    },
    blockNumber: 26714340,
  } as ContractCallResults,
};

const priceOracle: {
  [key: string]: ContractCallResults;
} = {
  isolatedAssets: {
    results: {
      '0x4736cd7783736425b3855581c3d40fb153daf322': {
        originalContractCallContext: {
          reference: '0x4736cd7783736425b3855581c3d40fb153daf322',
          contractAddress: '0x4736cd7783736425b3855581c3d40fb153daf322',
          abi: [
            {
              inputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'constructor',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'feed',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'string',
                  name: 'symbol',
                  type: 'string',
                },
              ],
              name: 'FeedSet',
              type: 'event',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'oldAdmin',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'newAdmin',
                  type: 'address',
                },
              ],
              name: 'NewAdmin',
              type: 'event',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'asset',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'previousPriceMantissa',
                  type: 'uint256',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'requestedPriceMantissa',
                  type: 'uint256',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'newPriceMantissa',
                  type: 'uint256',
                },
              ],
              name: 'PricePosted',
              type: 'event',
            },
            {
              constant: true,
              inputs: [],
              name: 'VAI_VALUE',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
            },
            {
              constant: true,
              inputs: [],
              name: 'admin',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
            },
            {
              constant: true,
              inputs: [
                {
                  internalType: 'address',
                  name: 'asset',
                  type: 'address',
                },
              ],
              name: 'assetPrices',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
            },
            {
              constant: true,
              inputs: [
                {
                  internalType: 'string',
                  name: 'symbol',
                  type: 'string',
                },
              ],
              name: 'getFeed',
              outputs: [
                {
                  internalType: 'contract AggregatorV2V3Interface',
                  name: '',
                  type: 'address',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
            },
            {
              constant: true,
              inputs: [
                {
                  internalType: 'contract VToken',
                  name: 'vToken',
                  type: 'address',
                },
              ],
              name: 'getUnderlyingPrice',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
            },
            {
              constant: true,
              inputs: [],
              name: 'isPriceOracle',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'address',
                  name: 'newAdmin',
                  type: 'address',
                },
              ],
              name: 'setAdmin',
              outputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'address',
                  name: 'asset',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'price',
                  type: 'uint256',
                },
              ],
              name: 'setDirectPrice',
              outputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'string',
                  name: 'symbol',
                  type: 'string',
                },
                {
                  internalType: 'address',
                  name: 'feed',
                  type: 'address',
                },
              ],
              name: 'setFeed',
              outputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'contract VToken',
                  name: 'vToken',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'underlyingPriceMantissa',
                  type: 'uint256',
                },
              ],
              name: 'setUnderlyingPrice',
              outputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
            },
          ],
          calls: [
            {
              reference: '0x37a0ac901578a7f05379fc43330b3d1e39d0c40c',
              methodName: 'getUnderlyingPrice',
              methodParameters: ['0x37a0ac901578a7f05379fc43330b3d1e39d0c40c'],
            },
            {
              reference: '0x75a10f0c415dccca275e8cdd8447d291a6b86f06',
              methodName: 'getUnderlyingPrice',
              methodParameters: ['0x75a10f0c415dccca275e8cdd8447d291a6b86f06'],
            },
            {
              reference: '0x12d3a3aa7f4917ea3b8ee34f99a9a7eec521fa61',
              methodName: 'getUnderlyingPrice',
              methodParameters: ['0x12d3a3aa7f4917ea3b8ee34f99a9a7eec521fa61'],
            },
            {
              reference: '0xcfc8a73f9c888eea9af9ccca24646e84a915510b',
              methodName: 'getUnderlyingPrice',
              methodParameters: ['0xcfc8a73f9c888eea9af9ccca24646e84a915510b'],
            },
          ],
        },
        callsReturnContext: [
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0506f19e29cf3cd73400',
              },
            ],
            decoded: true,
            reference: '0x37a0ac901578a7f05379fc43330b3d1e39d0c40c',
            methodName: 'getUnderlyingPrice',
            methodParameters: ['0x37a0ac901578a7f05379fc43330b3d1e39d0c40c'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x380814dbc0a3c000',
              },
            ],
            decoded: true,
            reference: '0x75a10f0c415dccca275e8cdd8447d291a6b86f06',
            methodName: 'getUnderlyingPrice',
            methodParameters: ['0x75a10f0c415dccca275e8cdd8447d291a6b86f06'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x10a60a0325bae1c000',
              },
            ],
            decoded: true,
            reference: '0x12d3a3aa7f4917ea3b8ee34f99a9a7eec521fa61',
            methodName: 'getUnderlyingPrice',
            methodParameters: ['0x12d3a3aa7f4917ea3b8ee34f99a9a7eec521fa61'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x106e639d76d98000',
              },
            ],
            decoded: true,
            reference: '0xcfc8a73f9c888eea9af9ccca24646e84a915510b',
            methodName: 'getUnderlyingPrice',
            methodParameters: ['0xcfc8a73f9c888eea9af9ccca24646e84a915510b'],
            success: true,
          },
        ],
      },
    },
    blockNumber: 27608260,
  },
};

export const resilientOracle = {
  results: {
    resilientOracle: {
      originalContractCallContext: {
        reference: 'resilientOracle',
        contractAddress: '0xB9e0E753630434d7863528cc73CB7AC638a7c8ff',
        abi: contractInfos.resilientOracle.abi,
        calls: [
          {
            reference: 'getPrice',
            methodName: 'getPrice',
            methodParameters: ['0xB9e0E753630434d7863528cc73CB7AC638a7c8ff'],
          },
        ],
      },
      callsReturnContext: [
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x0de4df6b80e3cc00',
            },
          ],
          decoded: true,
          reference: 'getPrice',
          methodName: 'getPrice',
          methodParameters: ['0xB9e0E753630434d7863528cc73CB7AC638a7c8ff'],
          success: true,
        },
      ],
    },
  },
  blockNumber: 31688260,
};

export default {
  interestRateModel,
  lenses,
  vaiController,
  priceOracle,
  resilientOracle,
};
