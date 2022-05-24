import React from 'react';
import { withThemeProvider, withCenterStory } from 'stories/decorators';
import { ToastContainer } from 'react-toastify';
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
          message: 'An internal error occurred: unsupported wallet. Please try again later',
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
          message: 'Success',
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
