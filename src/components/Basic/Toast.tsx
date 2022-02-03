import React from 'react';
import PropTypes from 'prop-types';
import { toast as toastify } from 'react-toastify';

export function Toast({ title, description, type, ...props }) {
  return (
    <div {...props} className={`toast_container_wrapper ${type}`}>
      {title && <p className="title">{title}</p>}
      {description && <p className="description">{description}</p>}
    </div>
  );
}

Toast.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  type: PropTypes.oneOf(['success', 'info', 'error'])
};

Toast.defaultProps = {
  title: '',
  description: '',
  type: 'success'
};

function toast(
  { title, description, type = 'success', ...props },
  options = {}
) {
  return toastify(
    <Toast title={title} description={description} type={type} {...props} />,
    options
  );
}

toast.info = (content, options) => toast({ ...content, type: 'info' }, options);
toast.error = (content, options) =>
  toast({ ...content, type: 'error' }, options);
toast.success = (content, options) =>
  toast({ ...content, type: 'success' }, options);
toast.update = toastify.update;

export default toast;
