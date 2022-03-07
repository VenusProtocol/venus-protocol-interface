import React from 'react';
import { toast as toastify, ToastOptions } from 'react-toastify';

interface ToastArgs {
  title: string;
  description?: string;
}
interface ToastProps extends ToastArgs {
  type: 'success' | 'info' | 'error';
}

export function Toast({ title, description, type, ...props }: ToastProps) {
  return (
    <div {...props} className={`toast_container_wrapper ${type}`}>
      {title && <p className="title">{title}</p>}
      {description && <p className="description">{description}</p>}
    </div>
  );
}

Toast.defaultProps = {
  title: '',
  description: '',
  type: 'success',
};

function toast({ title, description, type = 'success', ...props }: ToastProps, options = {}) {
  return toastify(
    <Toast title={title} description={description} type={type} {...props} />,
    options,
  );
}

toast.info = (content: ToastArgs, options?: ToastOptions) =>
  toast({ ...content, type: 'info' }, options);

toast.error = (content: ToastArgs, options?: ToastOptions) =>
  toast({ ...content, type: 'error' }, options);

toast.success = (content: ToastArgs, options?: ToastOptions) =>
  toast({ ...content, type: 'success' }, options);
toast.update = toastify.update;

export default toast;
