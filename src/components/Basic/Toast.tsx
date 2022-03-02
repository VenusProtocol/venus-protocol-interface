import React from 'react';
import { toast as toastify } from 'react-toastify';

interface ToastProps {
  title: string;
  description: string;
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

function toast({ title, description, type = 'success', ...props }: $TSFixMe, options = {}) {
  return toastify(
    <Toast title={title} description={description} type={type} {...props} />,
    options,
  );
}

toast.info = (content: $TSFixMe, options?: $TSFixMe) =>
  toast({ ...content, type: 'info' }, options);

toast.error = (content: $TSFixMe, options?: $TSFixMe) =>
  toast({ ...content, type: 'error' }, options);

toast.success = (content: $TSFixMe, options?: $TSFixMe) =>
  toast({ ...content, type: 'success' }, options);
toast.update = toastify.update;

export default toast;
