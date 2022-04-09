export class ToastError extends Error {
  title: string;

  description: string;

  constructor(title: string, description: string) {
    super(title);
    this.title = title;
    this.description = description;
  }
}
