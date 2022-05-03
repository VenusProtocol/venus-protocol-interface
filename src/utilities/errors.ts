export class UiError extends Error {
  title: string;

  description?: string;

  constructor(title: string, description?: string) {
    super(title);
    this.title = title;

    if (description) {
      this.description = description;
    }
  }
}

export class InternalError extends Error {
  message: string;

  constructor(message: string) {
    super(message);
    this.message = message;
  }
}
