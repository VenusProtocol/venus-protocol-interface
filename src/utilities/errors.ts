export class ToastError extends Error {
  title: string;

  description: string;

  constructor(title: string, description: string) {
    super(title);
    this.title = title;
    this.description = description;
  }
}

interface ContractRequest {
  arguments: Record<string, string>;
}
interface ContractResponse {
  receipt: string | undefined;
  reason: string | undefined;
  signature: string | undefined;
}

/**
 * Create an Error modeled after the Axios error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code.
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 */
export class ContractError extends Error {
  config: Record<string, unknown> | undefined;

  code?: string | undefined;

  request?: ContractRequest;

  response?: ContractResponse;
  // isAxiosError: boolean;

  constructor(
    message: string,
    code: string | undefined,
    config?: Record<string, unknown>,
    request?: ContractRequest,
    response?: ContractResponse,
  ) {
    super(message);
    this.message = message;
    this.code = code;
    this.config = config;
    this.request = request;
    this.response = response;
  }

  toJSON = () => ({
    // Standard
    message: this.message,
    name: this.name,
    stack: this.stack,
    // Contract
    config: this.config,
    code: this.code,
    request: this.request,
    response: this.response,
  });
}
