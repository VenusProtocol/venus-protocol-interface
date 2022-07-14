import React from 'react';
import { ToastContainer } from 'react-toastify';

import { withCenterStory, withThemeProvider } from 'stories/decorators';

import { toast } from '.';
import { Button } from '../Button';

export default {
  title: 'Components/Toast',
  decorators: [withThemeProvider, withCenterStory({ width: 500 })],
};

export const Error = () => (
  <>
    <ToastContainer />
    <Button
      onClick={() =>
        toast.error({
          message:
            'Transaction has been reverted by the EVM: { "blockHash": "0x71a794dcb14d0d942684537a94295f3d1ab038c85d71b0a418dde8e583bd809d", "blockNumber": 19610368, "contractAddress": null, "cumulativeGasUsed": 200062, "from": "0x6dbabc656f0af4ced7b387b9149751b0aca6e75b", "gasUsed": 200062, "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", "status": false, "to": "0x74469281310195a04840daf6edf576f559a3de80", "transactionHash": "0x9645725f185a0ca87c57306ce36aafb067f49a0492c9850f3fced8c4dfaaa1cf", "transactionIndex": 0, "type": "0x0", "events": {} }',
        })
      }
    >
      trigger toast error
    </Button>
  </>
);

export const Success = () => (
  <>
    <ToastContainer />
    <Button
      onClick={() =>
        toast.success({
          message: 'Transaction has been succeed by the EVM',
        })
      }
    >
      trigger toast success
    </Button>
  </>
);

export const Info = () => (
  <>
    <ToastContainer />
    <Button
      onClick={() =>
        toast.info({
          message: 'Info',
        })
      }
    >
      trigger toast info
    </Button>
  </>
);

export const Warning = () => (
  <>
    <ToastContainer />
    <Button
      onClick={() =>
        toast.warning({
          message: 'Warning',
        })
      }
    >
      trigger toast warning
    </Button>
  </>
);
