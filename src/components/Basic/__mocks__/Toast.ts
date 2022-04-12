export const Toast = () => null;

const toast = {
  info: jest.fn(),
  error: jest.fn(),
  success: jest.fn(),
  update: jest.fn(),
};

export default toast;
