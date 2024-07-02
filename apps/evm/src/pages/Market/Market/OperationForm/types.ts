export interface FormError<C extends string> {
  code: C;
  message?: string;
}
